import { IncomingForm } from 'formidable';
import { put } from '@vercel/blob';
import { promises as fs } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handleOptions = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Disposition');
  res.status(200).end();
};

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleOptions(req, res);
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Upload endpoint hit');
  
  try {
    // Parse the form data
    const { files } = await parseForm(req);
    const file = files?.file?.[0] || files?.file; // Handle both single and multiple file uploads
    
    if (!file) {
      console.error('No file found in the request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Uploading file to Vercel Blob:', file.originalFilename || file.newFilename, `(${file.size} bytes)`);
    
    try {
      // Read the file content
      const fileContent = await fs.readFile(file.filepath);
      
      // Upload the file to Vercel Blob Storage
      const blob = await put(file.originalFilename || file.newFilename, fileContent, { 
        access: 'public',
        addRandomSuffix: true // Ensure unique filenames
      });
      
      console.log('File uploaded successfully:', blob);
      return res.status(200).json(blob);
      
    } catch (blobError) {
      console.error('Vercel Blob upload error:', blobError);
      return res.status(500).json({ 
        error: 'Failed to upload file to storage',
        details: blobError.message 
      });
    }
    
  } catch (error) {
    console.error('Upload processing error:', error);
    return res.status(500).json({ 
      error: 'Failed to process upload',
      details: error.message 
    });
  }
}
import { put } from '@vercel/blob';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return handleOptions(req, res);
  }

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Upload endpoint hit');
  console.log('Content-Type header:', req.headers['content-type']);
  
  try {
    // Check content type to ensure it's multipart/form-data
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      console.error('Invalid content type:', contentType);
      return res.status(400).json({ error: 'Expected multipart/form-data' });
    }

    // We need to parse the multipart form data manually
    const formData = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => {
        const data = Buffer.concat(chunks);
        // This is a simplified approach - in a real app, you'd want to use a proper multipart parser
        const boundary = contentType.split('boundary=')[1];
        const parts = data.toString().split(`--${boundary}`);
        
        // Find the file part
        const filePart = parts.find(part => part.includes('filename='));
        if (!filePart) {
          return reject(new Error('No file found in the request'));
        }
        
        // Extract filename and content type
        const filenameMatch = filePart.match(/filename="([^"]+)"/);
        const contentTypeMatch = filePart.match(/Content-Type: ([^\r\n]+)/);
        
        if (!filenameMatch) {
          return reject(new Error('No filename found in the request'));
        }
        
        const filename = filenameMatch[1];
        const fileType = contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream';
        
        // Extract the file content (this is simplified and may not work for all files)
        const content = filePart.split('\r\n\r\n')[1];
        const file = new Blob([content], { type: fileType });
        file.name = filename;
        
        resolve({ file });
      });
      req.on('error', reject);
    });
    
    const { file } = formData;
    console.log('File from formData:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    if (!file) {
      console.error('No file found in the request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Uploading file to Vercel Blob:', file.name, `(${file.size} bytes)`);
    
    try {
      const blob = await put(file.name, file, { 
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

// Handle OPTIONS for CORS
async function handleOptions(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res.status(200).end();
}

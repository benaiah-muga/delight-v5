import nc from 'next-connect'
import path from 'path'
import fs from 'fs'
import { getProperties, saveProperties, initStore } from '../../../lib/store'

initStore()

const handler = nc()
  .post(async (req, res) => {
    try {
      // Parse the JSON body
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      // Authentication
      const cookie = require('cookie').parse(req.headers.cookie || '');
      const token = cookie.token;
      let sessions = {};
      
      try { 
        sessions = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'sessions.json'), 'utf-8') || '{}'); 
      } catch (e) {}
      
      if (!token || !sessions[token] || sessions[token].role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // Validate required fields
      if (!body.title || !body.description || !body.price) {
        return res.status(400).json({ error: 'Title, description, and price are required' });
      }
      
      const props = getProperties();
      const nextId = props.reduce((m, p) => Math.max(m, p.id), 0) + 1 || 1;
      
      // Create new property
      const newProperty = {
        id: nextId,
        title: String(body.title).slice(0, 200),
        description: String(body.description).slice(0, 2000),
        price: String(body.price).slice(0, 100),
        image: body.image || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to properties array and save
      props.push(newProperty);
      saveProperties(props);
      
      // Return the created property
      return res.status(201).json(newProperty);
      
    } catch (error) {
      console.error('Error creating property:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  })
  .get((req, res) => {
    try {
      const props = getProperties();
      // Ensure all properties have the required fields
      const formattedProps = props.map(p => ({
        id: p.id,
        title: p.title || 'Untitled Property',
        description: p.description || '',
        price: p.price || 'Price on request',
        image: p.image || '',
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString()
      }));
      
      return res.status(200).json(formattedProps);
    } catch (error) {
      console.error('Error fetching properties:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  })

// Enable JSON body parsing
// We need to parse the JSON body manually in the route
// because we're using next-connect with custom body parsing
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Set size limit for JSON body
    },
  },
}

export default handler

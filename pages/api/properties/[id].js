import nc from 'next-connect'
import path from 'path'
import fs from 'fs'
import { getProperties, saveProperties, initStore } from '../../../lib/store'

initStore()

const handler = nc()
  .all(async (req, res) => {
    try {
      const props = getProperties()
      const id = parseInt(req.query.id, 10)
      const propertyIndex = props.findIndex(p => p.id === id)
      
      if (propertyIndex === -1) {
        return res.status(404).json({ error: 'Property not found' })
      }
      
      const property = props[propertyIndex]
      
      // Handle GET request
      if (req.method === 'GET') {
        return res.status(200).json(property)
      }
      
      // Authentication for PUT and DELETE
      const cookies = require('cookie').parse(req.headers.cookie || '')
      const token = cookies.token
      let sessions = {}
      
      try { 
        sessions = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'sessions.json'), 'utf-8') || '{}') 
      } catch (e) {}
      
      if (!token || !sessions[token] || sessions[token].role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      
      // Handle PUT request
      if (req.method === 'PUT') {
        // Parse the JSON body
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
        
        // Validate required fields
        if (!body.title || !body.description || !body.price) {
          return res.status(400).json({ error: 'Title, description, and price are required' })
        }
        
        // Update the property
        const updatedProperty = {
          ...property,
          title: String(body.title).slice(0, 200),
          description: String(body.description).slice(0, 2000),
          price: String(body.price).slice(0, 100),
          image: body.image || property.image || '',
          updatedAt: new Date().toISOString()
        }
        
        // Update the property in the array and save
        props[propertyIndex] = updatedProperty
        saveProperties(props)
        
        return res.status(200).json(updatedProperty)
      }
      
      // Handle DELETE request
      if (req.method === 'DELETE') {
        props.splice(propertyIndex, 1)
        saveProperties(props)
        return res.status(200).json({ success: true })
      }
      
      // Method not allowed
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      return res.status(405).json({ error: `Method ${req.method} not allowed` })
      
    } catch (error) {
      console.error('Error in property API route:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  })

// Enable JSON body parsing with increased size limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Set size limit for JSON body
    },
  },
}
export default handler

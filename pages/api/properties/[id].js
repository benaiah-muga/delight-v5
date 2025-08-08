import nc from 'next-connect'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { getProperties, saveProperties, uploadsDir, initStore } from '../../../lib/store'

initStore()
const upload = multer({ dest: path.join(process.cwd(),'data','uploads') })
const handler = nc()
  .use(upload.single('image'))
  .all((req,res)=>{
    const props = getProperties()
    const id = parseInt(req.query.id,10)
    const idx = props.findIndex(p=>p.id===id)
    if (idx === -1) return res.status(404).end('Not found')
    // handle GET, PUT, DELETE
    const cookies = require('cookie').parse(req.headers.cookie || '')
    const token = cookies.token
    let sessions = {}
    try { sessions = JSON.parse(fs.readFileSync(path.join(process.cwd(),'data','sessions.json'),'utf-8')||'{}') } catch(e){}
    if (req.method === 'GET') return res.status(200).json(props[idx])
    if (req.method === 'PUT') {
      if (!token || !sessions[token]) return res.status(401).end('Unauthorized')
      // allow admin and demo? demo is read-only; only admin allowed
      if (sessions[token].role !== 'admin') return res.status(403).end('Forbidden')
      const body = req.body || {}
      if (!body.title || !body.description || !body.price) return res.status(400).end('Title, description, and price are required')
      props[idx].title = String(body.title).slice(0,200) || props[idx].title
      props[idx].description = String(body.description).slice(0,2000) || props[idx].description
      props[idx].price = String(body.price).slice(0,100) || props[idx].price
      if (req.file) props[idx].image = '/uploads/' + req.file.filename
      if (body.imageUrl) props[idx].image = body.imageUrl
      saveProperties(props)
      return res.status(200).json(props[idx])
    }
    if (req.method === 'DELETE') {
      if (!token || !sessions[token]) return res.status(401).end('Unauthorized')
      if (sessions[token].role !== 'admin') return res.status(403).end('Forbidden')
      props.splice(idx,1); saveProperties(props)
      return res.status(200).end()
    }
    res.status(405).end()
  })

export const config = { api: { bodyParser: false } }
export default handler

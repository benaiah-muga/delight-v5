import nc from 'next-connect'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { getProperties, saveProperties, uploadsDir, initStore, getUsers } from '../../../lib/store'

initStore()

const upload = multer({ dest: path.join(process.cwd(),'data','uploads') })
const handler = nc()
  .use(upload.single('image'))
  .post((req,res)=>{
    // auth
    const cookie = require('cookie').parse(req.headers.cookie || '')
    const token = cookie.token
    let sessions = {}
    try { sessions = JSON.parse(fs.readFileSync(path.join(process.cwd(),'data','sessions.json'),'utf-8')||'{}') } catch(e){}
    if (!token || !sessions[token] || sessions[token].role !== 'admin') return res.status(401).end('Unauthorized')
    const props = getProperties()
    const body = req.body || {}
    const nextId = props.reduce((m,p)=>Math.max(m,p.id),0) + 1 || 1
    let image = ''
    if (req.file) {
      image = '/uploads/' + req.file.filename
    } else if (body.imageUrl) {
      image = body.imageUrl
    }
    if (!body.title || !body.description || !body.price) return res.status(400).end('Title, description, and price are required')
    const p = { id: nextId, title: String(body.title).slice(0,200), description: String(body.description).slice(0,2000), price: String(body.price).slice(0,100), image }
    props.push(p)
    saveProperties(props)
    res.status(201).json(p)
  })
  .get((req,res)=>{
    const props = getProperties()
    // ensure images stored as absolute or relative; if uploaded, prefix with /data path handled by static next config
    res.status(200).json(props)
  })

export const config = {
  api: { bodyParser: false }
}

export default handler

import { initStore, getUsers, saveUsers } from '../../lib/store'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import cookie from 'cookie'

initStore()

export default function handler(req,res){
  if (req.method !== 'POST') return res.status(405).end()
  const { email, password } = req.body || {}
  const users = getUsers()
  const user = users.find(u=>u.email === email)
  if (!user) return res.status(401).end('Invalid credentials')
  const ok = bcrypt.compareSync(password, user.password)
  if (!ok) return res.status(401).end('Invalid credentials')
  // create session store in data/sessions.json
  const sessionsFile = path.join(process.cwd(),'data','sessions.json')
  let sessions = {}
  try { sessions = JSON.parse(fs.readFileSync(sessionsFile,'utf-8')||'{}') } catch(e){}
  const token = uuidv4()
  sessions[token] = { email: user.email, role: user.role, name: user.name, when: Date.now() }
  fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2))
  res.setHeader('Set-Cookie', cookie.serialize('token', token, { path: '/', httpOnly: true, secure: process.env.COOKIE_SECURE==='true', sameSite: 'lax', maxAge: 60*60*24 }))
  return res.status(200).json({ ok: true })
}

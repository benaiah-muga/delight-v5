import { initStore, getUsers, saveUsers } from '../../lib/store'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import cookie from 'cookie'

// Only initialize store in development
if (process.env.NODE_ENV !== 'production') {
  initStore()
}

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  
  const { email, password } = req.body || {}
  
  // In production, use environment variables for admin credentials
  if (process.env.NODE_ENV === 'production') {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
    
    if (email === adminEmail && adminPasswordHash) {
      const isPasswordValid = bcrypt.compareSync(password, adminPasswordHash)
      if (isPasswordValid) {
        const token = uuidv4()
        const cookieOptions = {
          path: '/',
          httpOnly: true,
          secure: process.env.COOKIE_SECURE === 'true',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 // 1 day
        }
        
        res.setHeader('Set-Cookie', cookie.serialize('token', token, cookieOptions))
        return res.status(200).json({ ok: true })
      }
    }
    return res.status(401).end('Invalid credentials')
  }
  
  // Development mode - use file-based auth
  try {
    const users = getUsers()
    const user = users.find(u => u.email === email)
    
    if (!user) return res.status(401).end('Invalid credentials')
    
    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) return res.status(401).end('Invalid credentials')
    
    // Create session
    const sessionsFile = path.join(process.cwd(), 'data', 'sessions.json')
    let sessions = {}
    
    try {
      sessions = JSON.parse(fs.readFileSync(sessionsFile, 'utf-8') || '{}')
    } catch (e) {
      console.error('Error reading sessions file:', e)
    }
    
    const token = uuidv4()
    sessions[token] = {
      email: user.email,
      role: user.role,
      name: user.name,
      when: Date.now()
    }
    
    try {
      fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2))
    } catch (e) {
      console.error('Error writing sessions file:', e)
    }
    
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 day
    }
    
    res.setHeader('Set-Cookie', cookie.serialize('token', token, cookieOptions))
    return res.status(200).json({ ok: true })
    
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).end('Internal server error')
  }
}

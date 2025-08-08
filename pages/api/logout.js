import fs from 'fs'
import path from 'path'
import cookie from 'cookie'

export default function handler(req,res){
  if (req.method !== 'POST') return res.status(405).end()
  const cookies = cookie.parse(req.headers.cookie || '')
  const token = cookies.token
  const sessionsFile = path.join(process.cwd(),'data','sessions.json')
  try {
    let sessions = JSON.parse(fs.readFileSync(sessionsFile,'utf-8')||'{}')
    if (token && sessions[token]) {
      delete sessions[token]
      fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2))
    }
  } catch(e){}
  res.setHeader('Set-Cookie', cookie.serialize('token', '', { path: '/', maxAge: 0 }))
  res.status(200).end()
}

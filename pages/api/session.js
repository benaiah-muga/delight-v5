import { initStore, getUsers } from '../../lib/store'
import cookie from 'cookie'
initStore()
export default function handler(req,res){
  const cookies = cookie.parse(req.headers.cookie || '')
  const token = cookies.token
  if (!token) return res.status(401).end()
  // simple token store in memory: token maps to email stored in /data/sessions.json is not implemented, but for demo we'll decode token as email:token
  // The login API sets cookie like email|random. We stored a simple value in sessions.json on login.
  try {
    const sessFile = require('fs').readFileSync(require('path').join(process.cwd(),'data','sessions.json'),'utf-8')
    const sessions = JSON.parse(sessFile || '{}')
    const s = sessions[token]
    if (!s) return res.status(401).end()
    return res.status(200).json({ email: s.email, role: s.role, name: s.name })
  } catch(e){
    return res.status(401).end()
  }
}

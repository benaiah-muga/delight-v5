import fs from 'fs'
import path from 'path'

export default function handler(req,res){
  const f = req.query.file
  const p = path.join(process.cwd(),'data','uploads', f)
  if (!fs.existsSync(p)) return res.status(404).end()
  const stream = fs.createReadStream(p)
  res.setHeader('Content-Type', 'application/octet-stream')
  stream.pipe(res)
}

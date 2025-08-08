import nodemailer from 'nodemailer'

function validateEmail(e){ return typeof e === 'string' && e.includes('@') && e.length < 254 }
export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).end()
  const { name, email, message } = req.body || {}
  if (!name || !email || !message) return res.status(400).end('Missing fields')
  if (!validateEmail(email)) return res.status(400).end('Invalid email')

  // Prefer SMTP if env provided, else attempt SendGrid using API key
  const SMTP_HOST = process.env.SMTP_HOST
  const SMTP_PORT = process.env.SMTP_PORT
  const SMTP_USER = process.env.SMTP_USER
  const SMTP_PASS = process.env.SMTP_PASS
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
  const TO = process.env.CONTACT_TO || 'info@delighthomes.example'

  try {
    if (SMTP_HOST && SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT ? parseInt(SMTP_PORT,10) : 587,
        secure: false,
        auth: { user: SMTP_USER, pass: SMTP_PASS }
      })
      await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: TO,
        subject: `Website inquiry from ${name}`,
        text: message,
        html: `<p>${message}</p><p>From: ${name} &lt;${email}&gt;</p>`
      })
      return res.status(200).json({ ok: true })
    } else if (SENDGRID_API_KEY) {
      // send via SendGrid API
      const body = {
        personalizations: [{ to: [{ email: TO }] }],
        from: { email },
        subject: `Website inquiry from ${name}`,
        content: [{ type: 'text/plain', value: message }]
      }
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method:'POST',
        headers: { 'Authorization': 'Bearer ' + SENDGRID_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      return res.status(200).json({ ok: true })
    } else {
      // fallback: write to data/contacts.json
      const fs = require('fs')
      const path = require('path')
      const p = path.join(process.cwd(),'data','contacts.json')
      let arr = []
      try { arr = JSON.parse(fs.readFileSync(p,'utf-8')||'[]') } catch(e){}
      arr.push({ name, email, message, when: Date.now() })
      fs.writeFileSync(p, JSON.stringify(arr, null, 2))
      return res.status(200).json({ ok: true, saved: true })
    }
  } catch(e){
    console.error(e)
    return res.status(500).end('Failed to send')
  }
}

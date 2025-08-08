import { useState } from 'react'

export default function Contact(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [msg,setMsg]=useState(''); const [ok,setOk]=useState(''); const [err,setErr]=useState('')

  async function submit(e){
    e.preventDefault()
    setOk(''); setErr('')
    const res = await fetch('/api/contact', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, message: msg })
    })
    if (res.ok) {
      const j = await res.json()
      if (j.saved) setOk('Saved locally (no mail service configured).')
      else setOk('Message sent — we will get back to you shortly.')
      setName(''); setEmail(''); setMsg('')
    } else {
      const txt = await res.text()
      setErr(txt || 'Failed to send')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-semibold mb-4">Contact Delight Homes</h2>
      <div className="bg-white p-6 rounded-lg card-shadow">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input className="mt-1 block w-full border rounded p-2" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input className="mt-1 block w-full border rounded p-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea className="mt-1 block w-full border rounded p-2" rows="6" value={msg} onChange={e=>setMsg(e.target.value)} required />
          </div>
          <div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Send Inquiry</button>
          </div>
        </form>
        {ok && <p className="mt-4 text-green-600">{ok}</p>}
        {err && <p className="mt-4 text-red-600">{err}</p>}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login(){
  const [email,setEmail]=useState(''); const [pass,setPass]=useState(''); const [err,setErr]=useState('')
  const router = useRouter()

  async function submit(e){
    e.preventDefault()
    const res = await fetch('/api/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, password: pass })
    })
    if (res.ok) router.push('/admin/dashboard')
    else {
      const txt = await res.text()
      setErr(txt || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg card-shadow">
        <h2 className="text-2xl font-bold mb-2">Staff Login</h2>
        <p className="text-sm text-gray-500 mb-4">Secure staff area for Delight Homes</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <input className="mt-1 block w-full border rounded p-2" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input type="password" className="mt-1 block w-full border rounded p-2" value={pass} onChange={e=>setPass(e.target.value)} required />
          </div>
          {err && <div className="text-red-600 text-sm">{err}</div>}
          <div className="flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

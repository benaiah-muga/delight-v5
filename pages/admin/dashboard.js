import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Dashboard(){
  const [propsList,setPropsList] = useState([])
  const [loading,setLoading] = useState(true)
  const [showForm,setShowForm] = useState(false)
  const [form, setForm] = useState({id:null,title:'',description:'',price:'',imageUrl:'',imageFile:null})
  const [userRole,setUserRole] = useState(null)

  useEffect(()=>{ fetchData() }, [])

  async function fetchData(){
    const r = await fetch('/api/properties')
    if (r.status === 401) { window.location.href = '/admin/login'; return }
    const list = await r.json()
    setPropsList(list)
    setLoading(false)
    // get session info
    const s = await fetch('/api/session')
    if (s.ok) {
      const j = await s.json(); setUserRole(j.role)
    }
  }

  function openCreate(){ setForm({id:null,title:'',description:'',price:'',imageUrl:''}); setShowForm(true) }
  function openEdit(p){ setForm({...p, imageUrl: p.image || ''}); setShowForm(true) }

  async function submitForm(e){
    e.preventDefault()
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('description', form.description)
    fd.append('price', form.price)
    if (form.imageFile) fd.append('image', form.imageFile)
    if (form.imageUrl) fd.append('imageUrl', form.imageUrl)
    let url = '/api/properties'
    let method = 'POST'
    if (form.id) { url = `/api/properties/${form.id}`; method = 'PUT' }
    const res = await fetch(url, { method, body: fd })
    if (res.ok) {
      setShowForm(false); fetchData()
    } else {
      const txt = await res.text(); alert(txt)
    }
  }

  async function remove(id){
    if (!confirm('Delete listing?')) return
    const res = await fetch('/api/properties/' + id, { method:'DELETE' })
    if (res.ok) fetchData()
    else alert('Failed to delete')
  }

  async function logout(){
    await fetch('/api/logout', { method:'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="space-x-2">
          <button onClick={openCreate} className="bg-green-600 text-white px-3 py-2 rounded">Add Listing</button>
          <button onClick={logout} className="bg-gray-200 px-3 py-2 rounded">Logout</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded card-shadow">
        {loading ? <p>Loading...</p> : (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="p-2">Image</th>
                <th className="p-2">Title</th>
                <th className="p-2">Price</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {propsList.map(p=>(
                <tr key={p.id} className="border-t">
                  <td className="p-2 w-24">
                    {p.image ? <img src={p.image} alt="" className="h-16 w-24 object-cover rounded" /> : <div className="h-16 w-24 bg-gray-100 rounded" />}
                  </td>
                  <td className="p-2">{p.title}</td>
                  <td className="p-2">{p.price}</td>
                  <td className="p-2">
                    <button onClick={()=>openEdit(p)} className="mr-2 bg-blue-600 text-white px-3 py-1 rounded">Edit</button>
                    {userRole === 'admin' && <button onClick={()=>remove(p.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded">
            <h3 className="text-xl font-semibold mb-4">{form.id ? 'Edit Listing' : 'Create Listing'}</h3>
            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <label className="text-sm">Title</label>
                <input className="mt-1 block w-full border rounded p-2" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
              </div>
              <div>
                <label className="text-sm">Description</label>
                <textarea className="mt-1 block w-full border rounded p-2" rows="4" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} required />
              </div>
              <div>
                <label className="text-sm">Price</label>
                <input className="mt-1 block w-full border rounded p-2" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required />
              </div>
              <div>
                <label className="text-sm">Image URL (optional)</label>
                <input className="mt-1 block w-full border rounded p-2" value={form.imageUrl} onChange={e=>setForm({...form, imageUrl:e.target.value})} />
              </div>
              <div>
                <label className="text-sm">Or upload image (optional)</label>
                <input type="file" className="mt-1 block" onChange={e=>setForm({...form, imageFile: e.target.files[0]})} />
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Save</button>
                <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2 rounded border">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

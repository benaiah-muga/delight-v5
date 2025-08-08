import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Dashboard(){
  const [propsList, setPropsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({id: null, title: '', description: '', price: '', imageUrl: '', imageFile: null})
  const [userRole, setUserRole] = useState(null)
  const [uploading, setUploading] = useState(false)

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

  async function submitForm(e) {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrl = form.imageUrl || '';
      
      // If there's a file to upload, use Vercel Blob Storage
      if (form.imageFile) {
        console.log('Preparing to upload file:', form.imageFile.name, form.imageFile.type, form.imageFile.size);
        
        const formData = new FormData();
        // The second parameter should be the file blob/object
        formData.append('file', form.imageFile, form.imageFile.name);
        
        console.log('Sending upload request to /api/upload');
        
        try {
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            // Don't set Content-Type header, let the browser set it with the correct boundary
          });
          
          console.log('Upload response status:', uploadResponse.status);
          
          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('Upload failed with status:', uploadResponse.status, 'Response:', errorText);
            throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
          }
          
          const result = await uploadResponse.json();
          console.log('Upload successful, result:', result);
          
          if (!result.url) {
            throw new Error('No URL returned from upload');
          }
          
          imageUrl = result.url;
          console.log('Image uploaded successfully, URL:', imageUrl);
          
        } catch (uploadError) {
          console.error('Error during file upload:', uploadError);
          throw new Error(`File upload failed: ${uploadError.message}`);
        }
      } else {
        console.log('No file to upload, using existing image URL:', imageUrl || 'none');
      }
      
      // Prepare the property data
      const propertyData = {
        title: form.title,
        description: form.description,
        price: form.price,
        image: imageUrl,
      }
      
      // Send the property data to your API
      let url = '/api/properties'
      let method = 'POST'
      
      if (form.id) {
        url = `/api/properties/${form.id}`
        method = 'PUT'
      }
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      })
      
      if (res.ok) {
        setShowForm(false)
        fetchData()
      } else {
        const txt = await res.text()
        alert(txt)
      }
    } catch (error) {
      console.error('Error saving property:', error);
      
      // Log more details about the error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        alert(`Error: ${error.response.data?.error || 'Failed to save property'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        alert('No response from server. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        alert(`Error: ${error.message || 'An error occurred while saving the property'}`);
      }
    } finally {
      setUploading(false);
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
                <input 
                  className="mt-1 block w-full border rounded p-2" 
                  value={form.imageUrl} 
                  onChange={e=>setForm({...form, imageUrl:e.target.value, imageFile: null})} 
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="text-sm">Or upload image (optional)</label>
                <input 
                  type="file" 
                  className="mt-1 block w-full" 
                  accept="image/*"
                  onChange={e=>{
                    if (e.target.files && e.target.files[0]) {
                      setForm({
                        ...form, 
                        imageFile: e.target.files[0],
                        imageUrl: '' // Clear URL if file is selected
                      })
                    }
                  }} 
                />
                {form.imageFile && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: {form.imageFile.name} ({(form.imageFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <button 
                  type="submit" 
                  className={`px-4 py-2 rounded text-white ${uploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Save'}
                </button>
                <button 
                  type="button" 
                  onClick={()=>setShowForm(false)} 
                  className="px-4 py-2 rounded border"
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

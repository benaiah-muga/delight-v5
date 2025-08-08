import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const slides = [
  { id:1, title: 'Find your dream home', subtitle: 'Quality properties across Kampala and surrounding areas', image: 'https://images.unsplash.com/photo-1505691723518-36a0b6a44f5b' },
  { id:2, title: 'Trusted Agents', subtitle: 'Friendly local agents to help you every step', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2' },
  { id:3, title: 'Modern Living', subtitle: 'Stylish apartments and family homes', image: 'https://images.unsplash.com/photo-1599423300746-b62533397364' },
]

export default function Home(){
  const [propsList, setPropsList] = useState([])
  const [active, setActive] = useState(0)

  useEffect(()=>{ fetch('/api/properties').then(r=>r.json()).then(setPropsList) }, [])

  useEffect(()=>{
    const t = setInterval(()=> setActive(a => (a+1) % slides.length), 5000)
    return ()=> clearInterval(t)
  },[])

  return (
    <div>
      <Head>
        <title>Delight Homes Limited</title>
      </Head>

      <section className="relative h-96 overflow-hidden">
        {slides.map((s,idx)=>(
          <div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ${idx===active? 'opacity-100 z-10':'opacity-0 z-0'}`}>
            <div style={{backgroundImage:`url(${s.image})`}} className="h-full bg-cover bg-center flex items-center">
              <div className="max-w-6xl mx-auto px-6">
                <div className="bg-white/70 backdrop-blur p-6 rounded-md max-w-xl">
                  <h1 className="text-3xl font-extrabold">{s.title}</h1>
                  <p className="mt-2 text-gray-700">{s.subtitle}</p>
                  <div className="mt-4">
                    <Link href="#listings" className="inline-block bg-blue-600 text-white font-semibold px-5 py-2 rounded">Browse Properties</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_,i)=>(
            <button key={i} onClick={()=>setActive(i)} className={`w-3 h-3 rounded-full ${i===active? 'bg-white':'bg-white/60'}`} />
          ))}
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Featured Listings</h2>
            <Link href="/contact" className="text-sm text-blue-600">Contact us for custom searches</Link>
          </div>
        </section>

        <section id="listings" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propsList.map(p=>(
            <Link href={`/properties/${p.id}`} key={p.id} className="group block">
              <article className="bg-white rounded-lg overflow-hidden card-shadow h-full flex flex-col hover:shadow-md transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  {p.image && (
                    <Image 
                      src={p.image} 
                      alt={p.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 33vw" 
                      style={{objectFit:'cover'}} 
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{p.description}</p>
                  <div className="mt-4 flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
                    <div className="text-blue-600 font-semibold">{p.price}</div>
                    <span className="text-sm text-blue-600 font-medium">View Details →</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </section>

        <footer className="mt-12 border-t pt-6 text-sm text-gray-600">
          <div className="flex justify-between items-center">
            <div>© Delight Homes Limited</div>
            <div>Contact: info@delighthomes.example | +256 700 000000</div>
          </div>
        </footer>
      </main>
    </div>
  )
}

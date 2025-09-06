import { useEffect, useState } from 'react'
import { api } from '../api'

export default function FiltersLabels(){
  const [labels, setLabels] = useState([])
  const [name, setName] = useState('')
  const load = async () => {
    const { data } = await api.get('/labels')
    setLabels(Array.isArray(data) ? data : [])
  }
  const add = async () => {
    if(!name.trim()) return
    await api.post('/labels', { name })
    setName('')
    load()
  }
  useEffect(()=>{ load() },[])
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Filters & Labels</h1>
        <div className="flex gap-2">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="New label" className="border rounded p-2" />
          <button onClick={add} className="px-3 py-1 rounded bg-black text-white">Add label</button>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {Array.isArray(labels) && labels.map(l => (
          <li key={l._id} className="border rounded p-3">🏷️ {l.name}</li>
        ))}
      </ul>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { api } from '../api'
import ProjectFormModal from '../components/ProjectFormModal'
import { useNavigate } from 'react-router-dom'

export default function Projects(){
  const [items, setItems] = useState([])
  const nav = useNavigate()
  const load = async () => {
    try {
      const { data } = await api.get('/projects')
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setItems([])
    }
  }
  useEffect(()=>{ load() },[])
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.isArray(items) && items.map(p => (
          <div key={p._id} className="p-4 bg-white border rounded shadow-sm">
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-600 line-clamp-2">{p.description}</div>
            <button onClick={()=>nav(`/projects/${p._id}`)} className="mt-3 px-3 py-1 rounded bg-indigo-600 text-white">Open</button>
          </div>
        ))}
        <button onClick={()=>document.dispatchEvent(new CustomEvent('open-project-modal'))} className="p-4 border-2 border-dashed rounded">+ Add project</button>
      </div>
      <ProjectFormModal onCreated={load} />
    </div>
  )
}
import { useEffect, useState } from 'react'
import { api } from '../api'

export default function ProjectFormModal({ onCreated }){
  const [open, setOpen] = useState(false)
  const [f, setF] = useState({ name:'', description:'' })

  useEffect(() => {
    const fn = () => setOpen(true)
    document.addEventListener('open-project-modal', fn)
    return () => document.removeEventListener('open-project-modal', fn)
  }, [])

  const submit = async e => {
    e.preventDefault()
    await api.post('/projects', f)
    setOpen(false)
    setF({ name:'', description:'' })
    onCreated?.()
  }

  if(!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <form onSubmit={submit} className="bg-white p-4 rounded w-full max-w-md space-y-3">
        <h2 className="text-lg font-semibold">New Project</h2>
        <input className="w-full border rounded p-2" placeholder="Name" value={f.name} onChange={e=>setF({...f, name:e.target.value})} />
        <textarea className="w-full border rounded p-2" placeholder="Description" value={f.description} onChange={e=>setF({...f, description:e.target.value})} />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={()=>setOpen(false)} className="px-3 py-1 rounded border">Cancel</button>
          <button disabled={!f.name} className="px-3 py-1 rounded bg-black text-white">Create</button>
        </div>
      </form>
    </div>
  )
}
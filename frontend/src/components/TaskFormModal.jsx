import { useEffect, useState } from 'react'
import { api } from '../api'
import LabelPicker from './LabelPicker'

export default function TaskFormModal({ defaultProjectId, onCreated }){
  const [open, setOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [sections, setSections] = useState([])
  const [f, setF] = useState({ title:'', description:'', startAt:'', dueAt:'', priority:'p2', labels:[], projectId:'', sectionId:'' })

  useEffect(() => {
    (async()=>{
      try {
        const { data } = await api.get('/projects')
        setProjects(Array.isArray(data) ? data : [])
      } catch {
        setProjects([])
      }
    })()
  }, [])

  useEffect(() => {
    (async()=>{
      if(f.projectId){
        try {
          const { data } = await api.get(`/sections/project/${f.projectId}`)
          setSections(Array.isArray(data) ? data : [])
        } catch {
          setSections([])
        }
      }
    })()
  }, [f.projectId])
  
  useEffect(() => {
    const handler = (e) => {
      const { projectId, sectionId } = e.detail || {}
      const pid = projectId || defaultProjectId || ''
      if (!pid) {
        console.error("Missing projectId in open-task-modal event")
        return
      }
      setF(prev => ({ ...prev, projectId: pid, sectionId: sectionId || '' }))
      setOpen(true)
    }
    document.addEventListener('open-task-modal', handler)
    return () => document.removeEventListener('open-task-modal', handler)
  }, [defaultProjectId])


  const submit = async e => {
    e.preventDefault()
    await api.post('/tasks', { ...f, sectionId: f.sectionId||null })
    setOpen(false)
    setF({ title:'', description:'', startAt:'', dueAt:'', priority:'p2', labels:[], projectId:'', sectionId:'' })
    onCreated?.()
  }

  if(!open) return null
  const canSave = f.title && f.labels.length>0 && f.projectId

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <form onSubmit={submit} className="bg-white p-4 rounded w-full max-w-xl space-y-3">
        <h2 className="text-lg font-semibold">New Task</h2>
        <input className="w-full border rounded p-2" placeholder="Title" value={f.title} onChange={e=>setF({...f, title:e.target.value})} />
        <textarea className="w-full border rounded p-2" placeholder="Description" value={f.description} onChange={e=>setF({...f, description:e.target.value})} />
        <div className="grid grid-cols-2 gap-2">
          <input type="datetime-local" className="border rounded p-2" value={f.startAt} onChange={e=>setF({...f, startAt:e.target.value})} />
          <input type="datetime-local" className="border rounded p-2" value={f.dueAt} onChange={e=>setF({...f, dueAt:e.target.value})} />
        </div>
        <div className="flex gap-2">
          {['p1','p2','p3','p4'].map(p => (
            <button type="button" key={p} onClick={()=>setF({...f, priority:p})} className={`px-3 py-1 rounded border ${f.priority===p?'bg-black text-white':''}`}>{p.toUpperCase()}</button>
          ))}
        </div>
        <LabelPicker value={f.labels} onChange={labels=>setF({...f, labels})} />
        <div className="grid grid-cols-2 gap-2">
          <select className="border rounded p-2" value={f.projectId} onChange={e=>setF({...f, projectId:e.target.value, sectionId:''})}>
             <option value="">Select project</option>
            {Array.isArray(projects) && projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <select className="border rounded p-2" value={f.sectionId} onChange={e=>setF({...f, sectionId:e.target.value})} disabled={!Array.isArray(sections) || !sections.length}>
            <option value="">(Optional) Section</option>
            {Array.isArray(sections) && sections.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={()=>setOpen(false)} className="px-3 py-1 rounded border">Cancel</button>
          <button disabled={!canSave} className="px-3 py-1 rounded bg-indigo-600 text-white disabled:opacity-50">Add Task</button>
        </div>
      </form>
    </div>
  )
}
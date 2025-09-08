// frontend/src/components/TaskFormModal.jsx
import React, { useEffect, useState } from 'react'
import { api } from '../api'
import LabelPicker from './LabelPicker'

export default function TaskFormModal({ defaultProjectId = '', onCreated }) {
  useEffect(()=>{
    function openHandler(e){
      const d = e?.detail || {};
      if(d.projectId) setProjectId && setProjectId(d.projectId);
      if(d.sectionId) setSectionId && setSectionId(d.sectionId);
      setOpen && setOpen(true);
    }
    document.addEventListener('open-task-modal', openHandler);
    return ()=>document.removeEventListener('open-task-modal', openHandler);
  },[]);

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startAt, setStartAt] = useState('')
  const [dueAt, setDueAt] = useState('')
  const [priority, setPriority] = useState('p2')
  const [projects, setProjects] = useState([])
  const [sections, setSections] = useState([])
  const [projectId, setProjectId] = useState(defaultProjectId)
  const [sectionId, setSectionId] = useState('')
  const [labels, setLabels] = useState([]) // selected label objects
  const [labelRemoving, setLabelRemoving] = useState(null) // label object being removed
  const canSave = title.trim() && labels.length > 0 && projectId

  useEffect(() => {
    (async () => {
      try {
        const [{ data: pj }, { data: sec }] = await Promise.all([
          api.get(`/projects`),
          api.get(`/sections/projects/${projectId}`)
        ])
        setProjects(Array.isArray(pj) ? pj : [])
        setSections(Array.isArray(sec) ? sec : [])
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  function handleSelectLabel(label) {
    if (!labels.find(l => l._id === label._id)) {
      setLabels(prev => [label, ...prev])
    }
  }

  function confirmRemove(label) {
    setLabelRemoving(label)
  }

  function doRemove() {
    if (labelRemoving) {
      setLabels(prev => prev.filter(l => l._id !== labelRemoving._id))
      setLabelRemoving(null)
    }
  }

  function cancelRemove() {
    setLabelRemoving(null)
  }

  async function submit(e) {
    e && e.preventDefault()
    if (!canSave) return
    try {
      // build payload
      const payload = {
        title: title.trim(),
        description,
        startAt: startAt || null,
        dueAt: dueAt || null,
        priority,
        projectId,
        sectionId: sectionId || null,
        labels: labels.map(l => l._id)
      }
      const res = await api.post('/tasks', payload)
      onCreated && onCreated(res.data)
      // reset
      setTitle(''); setDescription(''); setStartAt(''); setDueAt(''); setPriority('p2')
      setLabels([]); setProjectId(defaultProjectId); setSectionId('')
      setOpen(false)
    } catch (err) {
      console.error(err)
      alert('Create task failed')
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="px-3 py-2 bg-indigo-600 text-white rounded">+ Add Task</button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
            <h3 className="text-lg font-semibold mb-3">Create Task</h3>

            <div className="space-y-2">
              <input className="w-full p-2 border rounded" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />

              <textarea className="w-full p-2 border rounded" rows="3" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />

              <div className="grid grid-cols-2 gap-2">
                <input type="datetime-local" className="p-2 border rounded" value={startAt} onChange={e => setStartAt(e.target.value)} />
                <input type="datetime-local" className="p-2 border rounded" value={dueAt} onChange={e => setDueAt(e.target.value)} />
              </div>

              <div className="flex gap-2">
                <select className="p-2 border rounded" value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="p1">Priority 1</option>
                  <option value="p2">Priority 2</option>
                  <option value="p3">Priority 3</option>
                  <option value="p4">Priority 4</option>
                </select>

                <select className="p-2 border rounded flex-1" value={projectId} onChange={e => { setProjectId(e.target.value); setSectionId('') }}>
                  <option value="">Choose Project</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>

                <select className="p-2 border rounded" value={sectionId} onChange={e => setSectionId(e.target.value)}>
                  <option value={null}>Section (optional)</option>
                  {sections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <LabelPicker onSelect={handleSelectLabel} />
                <div className="mt-2 flex flex-wrap gap-2">
                  {labels.map(l => (
                    <div key={l._id} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                      <span className="text-sm">🏷️ {l.name}</span>
                      <button onClick={() => confirmRemove(l)} className="text-red-600 px-1">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => { setOpen(false) }} className="px-3 py-2 border rounded">Cancel</button>
                <button onClick={submit} disabled={!canSave} className={`px-3 py-2 rounded text-white ${!canSave ? 'bg-gray-400' : 'bg-green-600'}`}>
                  Add Task
                </button>
              </div>
            </div>
          </div>

          {/* Label remove modal */}
          {labelRemoving && (
            <div className="fixed inset-0 z-60 flex items-center justify-center">
              <div className="bg-black/40 absolute inset-0" onClick={cancelRemove} />
              <div className="bg-white p-5 rounded shadow-lg z-50 w-full max-w-sm">
                <h4 className="font-semibold mb-2">Remove label</h4>
                <p>Are you sure you want to remove the label <strong>{labelRemoving.name}</strong> from this task?</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={cancelRemove} className="px-3 py-1 border rounded">Cancel</button>
                  <button onClick={doRemove} className="px-3 py-1 bg-red-600 text-white rounded">Remove</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
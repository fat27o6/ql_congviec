import { useState, useEffect } from 'react'
import TaskCard from './TaskCard'
import { api } from '../api'

export default function Section({ title, sectionId, onUpdated, projectId }) {
  const [editing, setEditing] = useState(false)
  const [tasks, setTasks] = useState([])
  const [name, setName] = useState(title)

  const loadtask = async () =>{
    try {
      if (sectionId == null){
        const tasks = await api.get(`/tasks/projects/${projectId}/tasks`)
        setTasks(Array.isArray(tasks.data) ? tasks.data : [])
      }
      else{
        const tasks = await api.get(`/tasks/sections/${sectionId}`)
        setTasks(Array.isArray(tasks.data) ? tasks.data : [])
      }
    } catch (err) {
      console.error('Failed to load project detail:', err)
      setTasks([])
    }
  }

  const save = async () => {
    try {
      if (!sectionId) return
      await api.patch(`/sections/${sectionId}`, { name })
      setEditing(false)
      onUpdated?.()
    } catch (e) {
      console.error('Save section failed', e)
      alert(e?.response?.data?.error || 'Save section failed')
    }
  }

  const del = async () => {
    if (!sectionId) return
    if (!confirm('Delete section?')) return
    try {
      await api.delete(`/sections/${sectionId}`)
      onUpdated?.()
    } catch (e) {
      console.error('Delete section failed', e)
      alert(e?.response?.data?.error || 'Delete section failed')
    }
  }

  useEffect(() => { loadtask() }, [])

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {editing ? (
          <>
            <input
              className="border rounded p-1 flex-1"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <button onClick={save} className="px-2 py-1 rounded border">Save</button>
            <button onClick={() => setEditing(false)} className="px-2 py-1 rounded border">Cancel</button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold flex-1">{title}</h2>
            {sectionId && (
              <>
                <button onClick={() => setEditing(true)} className="px-2 py-1 rounded border">Edit</button>
                <button onClick={del} className="px-2 py-1 rounded border">Delete</button>
              </>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map(t => (
            <TaskCard key={t._id} task={t} onUpdated={onUpdated} onStatusChange={loadtask} />
          ))
        ) : (
          <div className="text-sm text-gray-500 italic">No tasks</div>
        )}
      </div>

      {sectionId && (
        <button
          onClick={() =>
            document.dispatchEvent(
              new CustomEvent('open-task-modal', {
                detail: { projectId, sectionId } // giữ ObjectId
              })
            )
          }
          className="px-3 py-1 rounded border"
        >
          + Add task
        </button>
      )}
    </div>
  )
}

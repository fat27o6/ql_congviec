import { useState } from 'react'
import TaskCard from './TaskCard'
import { api } from '../api'

export default function Section({ title, sectionId, tasks = [], onUpdated, projectId }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(title)

  const save = async () => {
    try {
      await api.patch(`/sections/${sectionId}`, { name })
      setEditing(false)
      onUpdated?.()
    } catch (e) {
      console.error('Save section failed', e)
      alert(e?.response?.data?.error || 'Save section failed')
    }
  }

  const del = async () => {
    if (!confirm('Delete section?')) return
    try {
      console.log("sections ID", sectionId)
      await api.delete(`/sections/${sectionId}`)
      onUpdated?.()
    } catch (e) {
      console.error('Delete section failed', e)
      alert(e?.response?.data?.error || 'Delete section failed')
    }
  }
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
          tasks.map(t => <TaskCard key={t._id} task={t} onUpdated={onUpdated} />)
        ) : (
          <div className="text-sm text-gray-500 italic">No tasks</div>
        )}
      </div>

      {sectionId && (
        <button
          onClick={() =>
            document.dispatchEvent(
              new CustomEvent('open-task-modal', {
                detail: { projectId, sectionId: sectionId || null }
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
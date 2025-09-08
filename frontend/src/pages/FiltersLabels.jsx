// frontend/src/pages/FiltersLabels.jsx
import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function FiltersLabels() {
  const [labels, setLabels] = useState([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [editing, setEditing] = useState(null)
  const [editName, setEditName] = useState('')
  const [deleting, setDeleting] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/labels')
      setLabels(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      setLabels([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!newName.trim()) return
    try {
      await api.post('/labels', { name: newName.trim() })
      setNewName('')
      await load()
    } catch (e) { console.error(e) }
  }

  const startEdit = l => { setEditing(l); setEditName(l.name) }
  const saveEdit = async () => {
    try {
      await api.put(`/labels/${editing._id}`, { name: editName.trim() })
      setEditing(null)
      setEditName('')
      await load()
    } catch (e) { console.error(e) }
  }

  const confirmDelete = l => setDeleting(l)
  const doDelete = async () => {
    try {
      await api.delete(`/labels/${deleting._id}`)
      setDeleting(null)
      await load()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Filters & Labels</h2>

      <div className="mb-4 flex gap-2">
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New label name" className="p-2 border rounded flex-1" />
        <button onClick={create} className="px-4 py-2 bg-blue-600 text-white rounded">Add label</button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-2">
          {labels.length === 0 && <div className="text-gray-500">No labels</div>}
          {labels.map(l => (
            <div key={l._id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium">🏷️ {l.name}</div>
                <div className="text-xs text-gray-500">Created: {new Date(l.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(l)} className="px-2 py-1 border rounded">Edit</button>
                <button onClick={() => confirmDelete(l)} className="px-2 py-1 border rounded text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="font-semibold mb-2">Edit label</h3>
            <input className="w-full p-2 border rounded mb-3" value={editName} onChange={e => setEditName(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-3 py-1 border rounded">Cancel</button>
              <button onClick={saveEdit} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {deleting && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <p>Are you sure you want to delete label <strong>{deleting.name}</strong>? This will remove it from tasks.</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setDeleting(null)} className="px-3 py-1 border rounded">Cancel</button>
              <button onClick={doDelete} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
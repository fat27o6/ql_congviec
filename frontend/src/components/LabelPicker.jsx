// frontend/src/components/LabelPicker.jsx
import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function LabelPicker({ onSelect }) {
  const [options, setOptions] = useState([])
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const { data } = await api.get('/labels')
      setOptions(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      setOptions([])
    }
  }

  async function handleCreate() {
    if (!newName.trim()) return
    setCreating(true)
    try {
      const res = await api.post('/labels', { name: newName.trim() })
      // API should return created label object
      const created = res.data || { name: newName.trim(), _id: res.data?._id }
      setOptions(prev => [created, ...prev])
      onSelect && onSelect(created)
      setNewName('')
    } catch (e) {
      console.error(e)
    } finally {
      setCreating(false)
    }
  }

  const filtered = options.filter(o => o.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Search labels..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="px-3 py-2 border rounded" onClick={load}>Refresh</button>
      </div>

      <div className="flex gap-2">
        <input className="flex-1 border p-2 rounded" placeholder="Create new label" value={newName} onChange={e => setNewName(e.target.value)} />
        <button disabled={!newName.trim() || creating} onClick={handleCreate} className={`px-3 py-2 rounded text-white ${!newName.trim() ? 'bg-gray-400' : 'bg-blue-600'}`}>
          {creating ? 'Creating...' : 'Create'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filtered.map(o => (
          <button
            key={o._id}
            onClick={() => onSelect && onSelect(o)}
            className="px-2 py-1 rounded-full border hover:bg-indigo-50"
            type="button"
          >
            🏷️ {o.name}
          </button>
        ))}
      </div>
    </div>
  )
}
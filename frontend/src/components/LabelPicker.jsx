import { useEffect, useState } from 'react'
import { api } from '../api'

export default function LabelPicker({ value, onChange }){
  const [options, setOptions] = useState([])
  const [input, setInput] = useState('')
  useEffect(()=>{ (async()=>{ 
    const { data } = await api.get('/labels'); 
    setOptions(Array.isArray(data) ? data : []) 
  })() },[])
  const toggle = (name) => {
    const set = new Set(value)
    set.has(name) ? set.delete(name) : set.add(name)
    onChange([...set])
  }
  const addCustom = () => {
    if(!input.trim()) return
    if(!value.includes(input)) onChange([...value, input.trim()])
    setInput('')
  }
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input className="border rounded p-2 flex-1" placeholder="Type to add custom label" value={input} onChange={e=>setInput(e.target.value)} />
        <button type="button" onClick={addCustom} className="px-3 py-1 rounded border">Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.isArray(options) && options.map(o => (
          <button type="button" key={o._id} onClick={()=>toggle(o.name)} className={`px-2 py-1 rounded border ${value.includes(o.name)?'bg-indigo-600 text-white':''}`}>🏷️ {o.name}</button>
        ))}
      </div>
    </div>
  )
}
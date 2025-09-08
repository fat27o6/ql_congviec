
import React, { useEffect, useState } from 'react'
import { api } from '../api'
import TaskCard from './TaskCard'

export default function FilterModal(){
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('')
  const [tasks, setTasks] = useState([])

  useEffect(()=>{
    function onCompleted(){ load('completed') }
    function onUpcoming(){ load('upcoming') }
    document.addEventListener('filter-completed', onCompleted)
    document.addEventListener('filter-upcoming', onUpcoming)
    return ()=>{ document.removeEventListener('filter-completed', onCompleted); document.removeEventListener('filter-upcoming', onUpcoming) }
  },[])

  async function load(m){
    setMode(m); setOpen(true)
    try{
      if(m==='completed'){
        const r = await api.get('/tasks?completed=true')
        setTasks(r.data||[])
      } else if(m==='upcoming'){
        const r = await api.get('/tasks?upcoming=true')
        setTasks(r.data||[])
      }
    }catch(e){ console.error(e) }
  }

  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black opacity-40" onClick={()=>setOpen(false)} />
      <div className="bg-white p-4 rounded shadow w-full max-w-3xl z-60">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{mode==='completed' ? 'Completed Tasks' : 'Upcoming Tasks'}</h3>
          <button onClick={()=>setOpen(false)} className="px-2 py-1 border rounded">Close</button>
        </div>
        <div className="mt-4 space-y-3">
          {tasks.map(t=> <TaskCard key={t._id} task={t} onUpdated={()=>load(mode)} />)}
        </div>
      </div>
    </div>
  )
}

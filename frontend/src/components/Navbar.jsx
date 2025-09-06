import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Navbar({ onLogo }){
  const nav = useNavigate()
  const { logout } = useAuth()
  return (
    <div className="sticky top-0 z-10 bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2">
        <button onClick={onLogo} className="font-bold text-xl">🗂️ Todolist</button>
        <div className="flex-1" />
        <button onClick={()=>nav('/')} className="px-3 py-1 rounded hover:bg-gray-100">Projects</button>
        <button onClick={()=>document.dispatchEvent(new CustomEvent('open-project-modal'))} className="px-3 py-1 rounded bg-black text-white">Add project</button>
        <button onClick={()=>document.dispatchEvent(new CustomEvent('open-task-modal', { detail: { projectId: null } }))} className="px-3 py-1 rounded bg-indigo-600 text-white">Add task</button>
        <button onClick={()=>document.dispatchEvent(new CustomEvent('open-search'))} className="px-3 py-1 rounded hover:bg-gray-100">Search</button>
        <button onClick={()=>document.dispatchEvent(new CustomEvent('filter-today'))} className="px-3 py-1 rounded hover:bg-gray-100">Today</button>
        <button onClick={()=>document.dispatchEvent(new CustomEvent('filter-upcoming'))} className="px-3 py-1 rounded hover:bg-gray-100">Upcoming</button>
        <button onClick={()=>document.dispatchEvent(new CustomEvent('filter-complete'))} className="px-3 py-1 rounded hover:bg-gray-100">Complete</button>
        <button onClick={()=>nav('/filters')} className="px-3 py-1 rounded hover:bg-gray-100">Filter & Label</button>
        <button onClick={logout} className="ml-2 px-3 py-1 rounded border">Logout</button>
      </div>
    </div>
  )
}
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Navbar({ onLogo }){
  const nav = useNavigate()
  const { logout } = useAuth()
  return (
    <div className="sticky top-0 z-10 bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2">
        <button onClick={()=>nav('/')} className="font-bold text-xl">🗂️ Todolist</button>
        <div className="flex-1" />
        <button onClick={()=>nav('/')} className="px-3 py-1 rounded hover:bg-gray-100">Projects</button>
        <button onClick={()=>document.dispatchEvent(new CustomEvent('open-project-modal'))} className="px-3 py-1 rounded bg-black text-white">📁 Add project</button>
        <button onClick={()=>document.dispatchEvent(new CustomEvent('open-task-modal', { detail: { projectId: null } }))} className="px-3 py-1 rounded bg-indigo-600 text-white">➕ Add task</button>
        <button onClick={() => nav("/search")}>🔍 Search</button>
        <button onClick={() => nav("/today")}>📅 Today</button>
        <button onClick={() => nav("/upcoming")}>⏳ Upcoming</button>
        <button onClick={() => nav("/complete")}>✅ Complete</button>
        <button onClick={()=>nav('/labels')} className="px-3 py-1 rounded hover:bg-gray-100">🏷️ Label</button>
        <button onClick={logout} className="ml-2 px-3 py-1 rounded border">Logout</button>
      </div>
    </div>
  )
}
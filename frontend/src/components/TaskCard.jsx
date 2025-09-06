import { useState } from 'react'
import { api } from '../api'
import { format } from 'date-fns'
import CommentDrawer from './CommentDrawer'

export default function TaskCard({ task, onUpdated }){
  const [showComments, setShowComments] = useState(false)
  const toggleComplete = async () => {
    await api.patch(`/tasks/${task._id}/status`, { completed: !task.completed })
    onUpdated?.()
  }
  return (
    <div className="p-3 bg-white border rounded">
      <div className="flex items-start gap-2">
        <input type="checkbox" checked={task.completed} onChange={toggleComplete} />
        <div className="flex-1">
          <div className="font-medium">{task.title}</div>
          <div className="text-sm text-gray-600 whitespace-pre-line">{task.description}</div>
          {task.dueAt && <div className="text-xs mt-1">Due: {format(new Date(task.dueAt), 'dd/MM/yyyy HH:mm')}</div>}
          <div className="mt-2 flex flex-wrap gap-1">
            {Array.isArray(task.labels) && task.labels?.map(l => <span key={l} className="text-xs px-2 py-0.5 rounded bg-gray-100 border">🏷️ {l}</span>)}
          </div>
        </div>
        <button className="text-sm px-2 py-1 rounded border">Edit</button>
        <button onClick={()=>setShowComments(true)} className="text-sm px-2 py-1 rounded border">Comments</button>
      </div>
      <CommentDrawer taskId={task._id} open={showComments} onClose={()=>setShowComments(false)} />
    </div>
  )
}
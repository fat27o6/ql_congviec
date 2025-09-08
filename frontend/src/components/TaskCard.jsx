import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { format } from 'date-fns'
import CommentDrawer from './CommentDrawer'

export default function TaskCard({ task, onUpdated, onStatusChange }){
  const nav = useNavigate()
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false)
  const taskId = task._id || task.id;

  async function handleDelete(){
    if(!confirm('Xác nhận xóa task này?')) return;
    try{
      const taskId = task._id || task.id;
      await api.delete(`/tasks/${taskId}`);
      onUpdated && onUpdated();
    }catch(e){ console.error(e); alert('Xóa thất bại'); }
  }

  async function handleEdit(){
    document.dispatchEvent(new CustomEvent('open-task-modal',{detail:{ projectId: task.projectId, sectionId: task.sectionId, taskId: task._id }}));
  }

  const toggleComplete = async () => {
    setLoading(true);
    try {
      const res = await api.patch(`/tasks/${taskId}/status`);
      if (onStatusChange) onStatusChange();
      if(res.data) onUpdated?.()
    } catch (err) {
      console.error("Toggle status error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-3 bg-white border rounded">
      <div className="flex items-start gap-2">
        <input type="checkbox" checked={task.completed} onChange={toggleComplete} disabled={loading} />
        <div className="flex-1">
          <div className="font-medium cursor-pointer text-blue-600" onClick={()=>nav(`/tasks/${taskId}`)}>
            {task.title}
          </div>
          <div className="text-sm text-gray-600 whitespace-pre-line">{task.description}</div>
          {task.dueAt && <div className="text-xs mt-1">Due: {format(new Date(task.dueAt), 'dd/MM/yyyy HH:mm')}</div>}
        </div>
        <button onClick={handleEdit} className="text-sm px-2 py-1 rounded border">Edit</button>
        <button onClick={handleDelete} className="text-sm px-2 py-1 rounded border">Delete</button>
        <button onClick={()=>setShowComments(true)} className="text-sm px-2 py-1 rounded border">Comments</button>
      </div>
      <CommentDrawer taskId={task._id || task.id} open={showComments} onClose={()=>setShowComments(false)} />
    </div>
  )
}
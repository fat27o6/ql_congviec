import { useEffect, useState } from 'react'
import { api } from '../api'

export default function CommentDrawer({ taskId, open, onClose }){
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const load = async ()=>{
    const { data } = await api.get(`/comments/task/${taskId}`)
    setComments(Array.isArray(data) ? data : [])
  }
  useEffect(()=>{ if(open) load() },[open, taskId])

  const add = async ()=>{
    if(!text.trim()) return
    await api.post('/comments', { taskId, text })
    setText('')
    load()
  }
  const del = async (id)=>{
    await api.delete(`/comments/${id}`)
    load()
  }

  if(!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end">
      <div className="bg-white w-full max-w-md p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">Comments</h2>
          <button onClick={onClose} className="px-2 py-1 rounded border">Close</button>
        </div>
        <div className="space-y-2 mb-4">
          {Array.isArray(comments) && comments.map(c => (
            <div key={c._id} className="border rounded p-2 flex justify-between">
              <div>
                <div className="text-sm">{c.text}</div>
                <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
              <button onClick={()=>del(c._id)} className="text-xs px-2 py-1 rounded border">Delete</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="Add comment" className="flex-1 border rounded p-2" />
          <button onClick={add} className="px-3 py-1 rounded bg-black text-white">Send</button>
        </div>
      </div>
    </div>
  )
}
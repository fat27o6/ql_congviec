import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Register(){
  const { register } = useAuth()
  const nav = useNavigate()
  const [f, setF] = useState({ username:'', email:'', password:'' })
  const [err, setErr] = useState('')
  const submit = async e => {
    e.preventDefault()
    try{ await register(f); nav('/login') }
    catch(e){ setErr(e?.response?.data?.error || 'Register failed') }
  }
  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Username" value={f.username} onChange={e=>setF({...f, username:e.target.value})} />
        <input className="w-full border rounded p-2" placeholder="Email" value={f.email} onChange={e=>setF({...f, email:e.target.value})} />
        <input className="w-full border rounded p-2" type="password" placeholder="Password" value={f.password} onChange={e=>setF({...f, password:e.target.value})} />
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <div className="flex gap-2">
          <button disabled={!f.username||!f.email||!f.password} className="flex-1 py-2 bg-black text-white rounded">Create account</button>
          <Link to="/login" className="flex-1 py-2 border rounded text-center">Back to Login</Link>
        </div>
      </form>
    </div>
  )
}
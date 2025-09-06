import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useNavigate, Link, useLocation } from 'react-router-dom'

export default function Login(){
  const [identity, setIdentity] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const from = loc.state?.from?.pathname || '/'

  const onSubmit = async e => {
    e.preventDefault()
    try{ 
      await login({ identity, password }); 
      window.location.href = from
    }
    catch(e){ setErr(e?.response?.data?.error || 'Login failed') }
  }

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Username or Email" value={identity} onChange={e=>setIdentity(e.target.value)} />
        <input className="w-full border rounded p-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <button disabled={!identity||!password} className="w-full py-2 bg-black text-white rounded">Login</button>
      </form>
      <div className="mt-4 text-sm">Chưa có tài khoản? <Link to="/register" className="text-indigo-600">Register</Link></div>
    </div>
  )
}
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import { useAuth } from './auth/AuthContext'

export default function App(){
  const { token } = useAuth()
  const storedToken = localStorage.getItem('token')
  const navigate = useNavigate()
  return (
    <div className="min-h-screen">
      {(token || storedToken) && <Navbar onLogo={()=>navigate('/')} />}
      <Outlet />
    </div>
  )
}
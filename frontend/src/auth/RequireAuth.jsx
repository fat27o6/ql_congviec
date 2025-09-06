import { useAuth } from './AuthContext'
import { Navigate, useLocation } from 'react-router-dom'
export default function RequireAuth({ children }){
  const { token } = useAuth()
  const loc = useLocation()
  if(!token) return <Navigate to="/login" state={{ from: loc }} replace />
  return children
}
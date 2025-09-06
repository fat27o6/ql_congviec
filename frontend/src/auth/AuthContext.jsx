import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api'

const Ctx = createContext()
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }){
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')||'null'))

  const login = async ({ identity, password }) => {
    const { data } = await api.post('/auth/login', { identity, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    // đồng bộ ngay lập tức
    setToken(data.token)
    setUser(data.user)
    // reload lại app để Navbar render ngay
    window.location.href = '/'
  }
  const register = async ({ username, email, password }) => {
    await api.post('/auth/register', { username, email, password })
  }
  const logout = () => { localStorage.clear(); setToken(null); setUser(null) }

  return <Ctx.Provider value={{ token, user, login, logout, register }}>{children}</Ctx.Provider>
}
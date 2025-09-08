import axios from 'axios'
const instance = axios.create({ baseURL: import.meta.env.VITE_API_BASE })
instance.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})
export default instance
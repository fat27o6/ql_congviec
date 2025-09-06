import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import Login from './pages/Login'
import Register from './pages/Register'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import FiltersLabels from './pages/FiltersLabels'
import { AuthProvider } from './auth/AuthContext'
import RequireAuth from './auth/RequireAuth'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}> 
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<RequireAuth><Projects /></RequireAuth>} />
            <Route path="/projects/:id" element={<RequireAuth><ProjectDetail /></RequireAuth>} />
            <Route path="/filters" element={<RequireAuth><FiltersLabels /></RequireAuth>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
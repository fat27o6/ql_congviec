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
import TaskDetail from './pages/TaskDetail'
import SearchPage from './pages/SearchPage'
import TodayPage from './pages/TodayPage'
import UpcomingPage from './pages/UpcomingPage'
import CompletePage from './pages/CompletePage'
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
            <Route path="/labels" element={<RequireAuth><FiltersLabels /></RequireAuth>} />
            <Route path="/tasks/:taskId" element={<RequireAuth><TaskDetail /></RequireAuth>} />
            <Route path="/search" element={<RequireAuth><SearchPage /></RequireAuth>} />
            <Route path="/today" element={<RequireAuth><TodayPage /></RequireAuth>} />
            <Route path="/upcoming" element={<RequireAuth><UpcomingPage /></RequireAuth>} />
            <Route path="/complete" element={<RequireAuth><CompletePage /></RequireAuth>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
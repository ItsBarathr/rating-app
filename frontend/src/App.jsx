import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ShareLinks from './pages/ShareLinks'
import PublicRate from './pages/PublicRate'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/v1/admin/verify', {
        credentials: 'include'
      })
      setIsAuthenticated(res.ok)
    } catch {
      setIsAuthenticated(false)
    }
  }

  if (isAuthenticated === null) {
    return <div className="loading">Loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/share-links" element={isAuthenticated ? <ShareLinks /> : <Navigate to="/login" />} />
        <Route path="/r/:slug" element={<PublicRate />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
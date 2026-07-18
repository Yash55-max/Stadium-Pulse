import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { UserDashboard } from './pages/UserDashboard'
import { OpsDashboard } from './pages/OpsDashboard'
import { IncidentList } from './pages/IncidentList'
import { Login } from './pages/Login'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col font-body-md text-on-surface">
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/user" element={<UserDashboard />} />
              <Route path="/ops" element={<OpsDashboard />} />
              <Route path="/ops/incidents" element={<IncidentList />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={
              <div className="p-8 text-center text-critical-red h-screen flex items-center justify-center flex-col gap-4">
                <span className="material-symbols-outlined text-6xl">error</span>
                <h1 className="text-2xl font-headline-md font-bold mb-2">404 - Zone Not Found</h1>
                <p>The requested route does not exist.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App

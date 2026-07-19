import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { UserDashboard } from './pages/UserDashboard'
import { OpsDashboard } from './pages/OpsDashboard'
import { IncidentList } from './pages/IncidentList'
import { Login } from './pages/Login'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col font-body-md text-on-surface dark:text-white bg-background dark:bg-surface-dark transition-colors duration-200">
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user" element={<UserDashboard />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
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

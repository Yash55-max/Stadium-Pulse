import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Note: In a real app, Sidebar and TopHeader would be abstracted into a Layout component. 
// Duplicating here for simplicity as per the implementation plan.
function Sidebar({ logout }: { logout: () => void }) {
  const loc = useLocation()
  return (
    <aside className="hidden md:flex flex-col py-6 px-4 space-y-4 h-screen w-64 fixed left-0 top-0 bg-surface-container-low dark:bg-surface-dark border-r border-outline-variant dark:border-outline z-50">
      <div className="mb-8 flex flex-col">
        <span className="font-headline-md text-headline-md font-bold text-stadium-blue">StadiumPulse</span>
        <span className="font-label-caps text-label-caps text-on-surface-variant mt-1">Command Center</span>
      </div>
      <div className="flex items-center space-x-3 px-2 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
          <span className="material-symbols-outlined text-stadium-blue">hub</span>
        </div>
        <div>
          <p className="font-body-md text-body-md font-bold text-on-surface">Hub 01</p>
          <p className="text-xs text-on-surface-variant">Global Ops</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        <Link to="/ops" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${loc.pathname === '/ops' ? 'bg-primary-container text-on-primary-container font-bold translate-x-1 duration-200' : 'text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container'}`}>
          <span className="material-symbols-outlined">analytics</span>
          <span className="font-label-caps text-label-caps">Ops Intel</span>
        </Link>
        <Link to="/ops/incidents" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${loc.pathname === '/ops/incidents' ? 'bg-primary-container text-on-primary-container font-bold translate-x-1 duration-200' : 'text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container'}`}>
          <span className="material-symbols-outlined">warning</span>
          <span className="font-label-caps text-label-caps">Incident Triage</span>
        </Link>
        <Link to="/" className="flex items-center space-x-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container transition-all rounded-lg">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-caps text-label-caps">Home Hub</span>
        </Link>
      </nav>
      <button className="mt-auto w-full py-3 px-4 bg-stadium-blue text-white rounded-lg font-bold flex items-center justify-center space-x-2 hover:opacity-90 active:scale-95 transition-all mb-3">
        <span className="material-symbols-outlined">add_circle</span>
        <span className="font-label-caps text-label-caps">New Incident</span>
      </button>
      <button 
        onClick={logout} 
        className="w-full py-3 px-4 bg-surface dark:bg-slate-800 text-critical-red rounded-lg font-bold flex items-center justify-center space-x-2 border border-critical-red/20 hover:bg-error-container dark:hover:bg-error-container/20 transition-all"
      >
        <span className="material-symbols-outlined">logout</span>
        <span className="font-label-caps text-label-caps">Logout</span>
      </button>
    </aside>
  )
}

function TopHeader({ user }: { user: any }) {
  return (
    <header className="flex justify-between items-center w-full px-margin-desktop h-16 bg-surface dark:bg-surface-dark border-b border-outline-variant dark:border-outline z-40 sticky top-0">
      <div className="flex items-center space-x-8 flex-1">
        <div className="relative w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input className="w-full bg-surface-container-low dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-stadium-blue focus:border-transparent outline-none text-sm transition-all dark:text-white dark:placeholder-slate-400" placeholder="Search incidents..." type="text"/>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4 mr-4 border-r border-outline-variant pr-6">
          <button className="p-2 text-on-surface-variant hover:text-stadium-blue transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-critical-red rounded-full"></span>
          </button>
          <button className="p-2 text-on-surface-variant hover:text-stadium-blue transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="font-body-md text-sm font-bold text-on-surface dark:text-white">{user?.name}</p>
            <p className="text-xs text-on-surface-variant dark:text-slate-400">{user?.role}</p>
          </div>
          <img className="w-10 h-10 rounded-full border border-outline-variant object-cover" src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDd18Kljd8UHx3d6QCGS9SDJkcC70ns0T0iNOI4Ig0xQ2yuoaJQw7BC7euUaLpzDfKwvA6hBhtHymHggybouNJa9Qugg1uK6rEAPsAc-2AqB59VyxSy0B00jkgMqU2UhBvRdevQNUbCu3t38eddX75U-S2bXPhgW5GwE0IiQ_VYNqMAm7XwFi6BYh00IWDBMevsenIYRXMZkBJdlkaPLB04U25r4ZHZvf6RR6fYisrQaH_SI-L3vTdXlkDJILpAi3qfu1hzU0vqEPA"}/>
        </div>
      </div>
    </header>
  )
}

export function IncidentList() {
  const [incidents, setIncidents] = useState<any[]>([])
  const { user, logout } = useAuth()

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/ops/incidents')
        const json = await res.json()
        setIncidents(json.incidents || [])
      } catch (e) {
        console.error(e)
      }
    }
    fetchIncidents()
    const int = setInterval(fetchIncidents, 5000)
    return () => clearInterval(int)
  }, [])

  return (
    <div className="flex h-screen bg-background dark:bg-surface-dark overflow-hidden font-body-md text-on-surface dark:text-white">
      <Sidebar logout={logout} />
      <main className="md:ml-64 flex flex-col flex-1 h-screen overflow-hidden">
        <TopHeader user={user} />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Filter Sidebar */}
          <aside className="w-72 bg-surface-container-lowest dark:bg-slate-800 border-r border-outline-variant dark:border-slate-700 p-6 custom-scrollbar overflow-y-auto hidden lg:block">
            <h2 className="font-headline-md text-headline-md mb-6">Filters</h2>
            <div className="space-y-8">
              <section>
                <label className="font-label-caps text-label-caps text-outline uppercase block mb-3">Severity</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input defaultChecked className="form-checkbox rounded text-critical-red border-outline-variant focus:ring-critical-red" type="checkbox"/>
                    <span className="text-body-md group-hover:text-critical-red transition-colors">Critical</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input defaultChecked className="form-checkbox rounded text-alert-orange border-outline-variant focus:ring-alert-orange" type="checkbox"/>
                    <span className="text-body-md group-hover:text-alert-orange transition-colors">High</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input defaultChecked className="form-checkbox rounded text-stadium-blue border-outline-variant focus:ring-stadium-blue" type="checkbox"/>
                    <span className="text-body-md group-hover:text-stadium-blue transition-colors">Medium</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input className="form-checkbox rounded text-pitch-green border-outline-variant focus:ring-pitch-green" type="checkbox"/>
                    <span className="text-body-md group-hover:text-pitch-green transition-colors">Low</span>
                  </label>
                </div>
              </section>
            </div>
          </aside>

          {/* Incident Table area */}
          <div className="flex-1 flex flex-col bg-background dark:bg-surface-dark">
            <div className="p-6 border-b border-outline-variant dark:border-slate-700 flex justify-between items-center bg-surface dark:bg-slate-800">
              <div>
                <h1 className="font-headline-lg text-headline-lg">Active Incidents</h1>
                <p className="text-on-surface-variant text-body-md">{incidents.length} unacknowledged reports requiring attention.</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-surface-container-high px-4 py-2 rounded-full flex items-center space-x-2">
                  <span className="w-2 h-2 bg-critical-red rounded-full animate-pulse"></span>
                  <span className="font-status-indicator text-status-indicator font-bold">LIVE OPS</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="grid grid-cols-1 gap-4">
                {incidents.length === 0 ? (
                  <div className="p-8 text-center text-on-surface-variant dark:text-slate-400 bg-surface-container-lowest dark:bg-slate-800 rounded-xl border border-outline-variant dark:border-slate-700">
                    <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant dark:text-slate-500">task_alt</span>
                    <p>No active incidents.</p>
                  </div>
                ) : (
                  incidents.slice().reverse().map(inc => {
                    const isCritical = inc.severity === 'critical'
                    const isHigh = inc.severity === 'high'
                    const severityClass = isCritical ? 'severity-critical' : isHigh ? 'severity-high' : 'severity-med'
                    const badgeClass = isCritical ? 'bg-critical-red' : isHigh ? 'bg-alert-orange' : 'bg-stadium-blue'
                    
                    return (
                      <div key={inc.id} className={`bg-surface-container-lowest dark:bg-slate-800 p-5 rounded-xl border border-outline-variant dark:border-slate-700 shadow-sm ${severityClass} flex flex-col lg:flex-row gap-6`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`px-2 py-1 ${badgeClass} text-white font-label-caps text-[10px] rounded`}>
                              {inc.severity?.toUpperCase() || 'PROCESSING'}
                            </span>
                            <span className="font-label-caps text-on-surface-variant dark:text-slate-400">{inc.id}</span>
                            <span className="font-label-caps text-on-surface-variant dark:text-slate-400">•</span>
                            <span className="font-label-caps text-on-surface-variant dark:text-slate-400">{new Date(inc.created_at).toLocaleTimeString()}</span>
                          </div>
                          <h3 className="font-headline-md text-lg text-on-surface dark:text-white mb-2">{inc.type || 'Incoming Report'}</h3>
                          <p className="text-on-surface-variant dark:text-slate-300 text-sm mb-4">"{inc.raw_text}"</p>
                        </div>
                        <div className="w-full lg:w-1/3 bg-surface dark:bg-slate-700 p-4 rounded-lg border border-outline-variant/50 dark:border-slate-600 flex flex-col justify-center">
                          <span className="font-label-caps text-xs text-on-surface-variant dark:text-slate-400 mb-2">AI Recommendation</span>
                          <p className="text-sm font-medium text-stadium-blue italic">
                            {inc.recommended_response || 'Analyzing...'}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

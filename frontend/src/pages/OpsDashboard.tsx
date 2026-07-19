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
          <input className="w-full bg-surface-container-low dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-stadium-blue focus:border-transparent outline-none text-sm transition-all dark:text-white dark:placeholder-slate-400" placeholder="Global search..." type="text"/>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-label-caps text-label-caps text-on-surface-variant">Live Status:</span>
          <div className="flex items-center space-x-2 bg-critical-red/10 px-3 py-1 rounded-full border border-critical-red/20">
            <span className="w-2 h-2 rounded-full bg-critical-red animate-pulse"></span>
            <span className="font-status-indicator text-status-indicator text-critical-red font-bold">Live Data</span>
          </div>
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

export function OpsDashboard() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const { user, logout } = useAuth()

  useEffect(() => {
    // Poll every 5 seconds
    const fetchOps = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/ops/summary')
        const json = await res.json()
        setData(json)
        setError(null)
      } catch (err) {
        setError("Unable to reach simulator API. Is backend running?")
      }
    }
    fetchOps()
    const int = setInterval(fetchOps, 5000)
    return () => clearInterval(int)
  }, [])

  return (
    <div className="flex h-screen bg-background dark:bg-surface-dark overflow-hidden font-body-md text-on-surface dark:text-white">
      <Sidebar logout={logout} />
      <main className="md:ml-64 flex flex-col flex-1 h-screen overflow-hidden">
        <TopHeader user={user} />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-margin-desktop">
          <div className="max-w-container-max-width mx-auto">
            {error ? (
              <div className="p-6 bg-error-container text-on-error-container rounded-xl">{error}</div>
            ) : !data ? (
              <div className="p-6 text-on-surface-variant animate-pulse font-label-caps">Initializing sensors...</div>
            ) : (
              <>
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-gutter">
                  <div className="bg-surface-container-lowest dark:bg-slate-800 p-6 rounded-xl border border-outline-variant dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-label-caps text-label-caps text-on-surface-variant">Total Attendance</span>
                      <span className="material-symbols-outlined text-stadium-blue">groups</span>
                    </div>
                    <div className="flex items-end space-x-2">
                      <span className="font-headline-lg text-headline-lg text-on-surface">68,402</span>
                    </div>
                    <div className="mt-4 w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                      <div className="bg-stadium-blue h-full w-[82%] rounded-full"></div>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest dark:bg-slate-800 p-6 rounded-xl border border-outline-variant dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-label-caps text-label-caps text-on-surface-variant">Active Incidents</span>
                      <span className="material-symbols-outlined text-critical-red">report</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-headline-lg text-headline-lg text-on-surface">3</span>
                    </div>
                    <p className="mt-3 text-xs text-on-surface-variant">Requires immediate review</p>
                  </div>

                  <div className="bg-surface-container-lowest dark:bg-slate-800 p-6 rounded-xl border border-outline-variant dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-label-caps text-label-caps text-on-surface-variant">Transport Load</span>
                      <span className="material-symbols-outlined text-info-blue">train</span>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      {data.live_state.transport.slice(0, 2).map((t: any) => (
                        <div key={t.id} className="flex justify-between items-center text-sm">
                          <span className="font-bold">{t.id}</span>
                          <span className="text-on-surface-variant text-xs">{t.current_load}/{t.capacity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                  {/* Heatmap / Zone Cards */}
                  <div className="lg:col-span-2 bg-surface-container-lowest dark:bg-slate-800 p-6 rounded-xl border border-outline-variant dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-headline-md text-headline-md text-on-surface dark:text-white">Crowd Density (Zones)</h2>
                      <span className="material-symbols-outlined text-on-surface-variant dark:text-slate-400">map</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {Object.values(data.live_state.zones).map((z: any) => {
                        const isHigh = z.pct > 0.8
                        return (
                          <div key={z.name} className={`p-4 rounded-lg border ${isHigh ? 'border-critical-red bg-error-container dark:bg-error-container/20 text-on-error-container dark:text-red-400' : 'border-outline-variant dark:border-slate-600 bg-surface dark:bg-slate-700'}`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-lg">{z.name}</span>
                              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>{isHigh ? 'warning' : 'check_circle'}</span>
                            </div>
                            <div className={`w-full h-2 rounded-full overflow-hidden ${isHigh ? 'bg-critical-red/20' : 'bg-surface-container-highest dark:bg-slate-600'}`}>
                              <div className={`h-full rounded-full ${isHigh ? 'bg-critical-red' : 'bg-stadium-blue'}`} style={{ width: `${z.pct * 100}%` }}></div>
                            </div>
                            <div className="mt-2 font-label-caps text-xs text-right opacity-80">
                              {z.current} / {z.capacity} ({Math.round(z.pct * 100)}%)
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* AI Intelligence Panel */}
                  <div className="bg-surface-container-lowest dark:bg-slate-800 p-6 rounded-xl border-t-4 border-t-alert-orange border-x border-b border-outline-variant dark:border-x-slate-700 dark:border-b-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded bg-alert-orange/10 flex items-center justify-center text-alert-orange">
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>psychology</span>
                      </div>
                      <h2 className="font-headline-md text-headline-md text-on-surface dark:text-white">Ops Intelligence</h2>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400 uppercase tracking-widest mb-3">Situational Summary</h3>
                      <p className="text-sm leading-relaxed text-on-surface dark:text-slate-200">{data.intelligence.summary}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400 uppercase tracking-widest mb-3">Recommended Actions</h3>
                      {data.intelligence.actions?.length === 0 ? (
                        <p className="text-sm text-on-surface-variant italic">No immediate actions required.</p>
                      ) : (
                        <div className="space-y-3">
                          {data.intelligence.actions?.map((act: any, i: number) => {
                            const isHigh = act.priority === 'high'
                            return (
                              <div key={i} className={`p-4 rounded-lg border-l-4 bg-surface dark:bg-slate-700 ${isHigh ? 'border-l-critical-red border-y border-r border-outline-variant dark:border-y-slate-600 dark:border-r-slate-600' : 'border-l-stadium-blue border-y border-r border-outline-variant dark:border-y-slate-600 dark:border-r-slate-600'}`}>
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-bold text-sm text-on-surface dark:text-white">{act.action}</span>
                                  <span className={`px-2 py-0.5 rounded font-label-caps text-[10px] ${isHigh ? 'bg-critical-red text-white' : 'bg-surface-container-high dark:bg-slate-600 text-on-surface dark:text-white'}`}>{act.priority}</span>
                                </div>
                                <div className="text-xs text-on-surface-variant dark:text-slate-400 mb-2">Zone: <span className="font-bold text-stadium-blue dark:text-primary-fixed-dim">{act.target_zone || 'Global'}</span></div>
                                <div className="text-xs text-on-surface-variant dark:text-slate-300 bg-surface-container-lowest dark:bg-slate-800 p-2 rounded border border-outline-variant/50 dark:border-slate-600">
                                  {act.rationale}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

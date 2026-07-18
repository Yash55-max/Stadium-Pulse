import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-mesh font-body-md text-on-surface">
      {/* Top Navigation */}
      <header className="flex justify-between items-center px-8 py-4 bg-surface border-b border-outline-variant">
        <div className="font-headline-md text-headline-md font-bold text-stadium-blue uppercase tracking-wider">
          StadiumPulse
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 text-sm font-label-caps border border-outline-variant rounded hover:bg-surface-container-high transition-colors text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">security</span>
            Staff Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto w-full">
        <span className="bg-primary-fixed text-stadium-blue px-3 py-1 rounded-full font-label-caps text-[10px] mb-6 uppercase tracking-widest border border-primary-fixed-dim shadow-sm">
          Welcome to the World Cup 2026
        </span>
        <h1 className="font-headline-xl text-5xl font-bold text-on-surface mb-6 leading-tight">
          Your Smart Stadium <br/><span className="text-stadium-blue">Fan Portal</span>
        </h1>
        <p className="font-body-lg text-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
          Get real-time directions, step-free routes, live transit updates, and instant answers in over 50 languages with our AI-powered assistant.
        </p>

        {/* Primary CTA */}
        <Link 
          to="/user"
          className="bg-stadium-blue text-white px-8 py-4 rounded-full font-headline-md text-xl flex items-center gap-3 hover:bg-primary transition-all hover:scale-105 shadow-lg shadow-stadium-blue/20 mb-16"
        >
          <span className="material-symbols-outlined text-3xl">smart_toy</span>
          Chat with Fan Assistant
        </Link>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col items-start">
            <span className="material-symbols-outlined text-alert-orange mb-3 text-3xl">event</span>
            <h3 className="font-headline-md text-lg text-on-surface mb-1">Next Match</h3>
            <p className="text-on-surface-variant text-sm font-bold">Brazil vs. France</p>
            <p className="text-on-surface-variant text-xs mt-1">Kickoff: 8:00 PM</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col items-start">
            <span className="material-symbols-outlined text-pitch-green mb-3 text-3xl">meeting_room</span>
            <h3 className="font-headline-md text-lg text-on-surface mb-1">Gate Status</h3>
            <p className="text-on-surface-variant text-sm font-bold">All Gates Open</p>
            <p className="text-on-surface-variant text-xs mt-1">Average wait: 4 mins</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col items-start">
            <span className="material-symbols-outlined text-info-blue mb-3 text-3xl">directions_transit</span>
            <h3 className="font-headline-md text-lg text-on-surface mb-1">Transit</h3>
            <p className="text-on-surface-variant text-sm font-bold">Metro Line 1 Active</p>
            <p className="text-on-surface-variant text-xs mt-1">Next train in 2 mins</p>
          </div>
        </div>
      </div>
    </div>
  )
}

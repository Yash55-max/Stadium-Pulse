import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { TraceDrawer, TraceDetail } from '../components/TraceDrawer'

export interface ChatMessage {
  role: string;
  content: string;
  trace?: TraceDetail[];
}

export function FanAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isAccessible, setIsAccessible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTrace, setActiveTrace] = useState<TraceDetail[] | null>(null)
  
  const location = useLocation()
  const initialized = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const sendMessage = async (text: string, acc: boolean, currentMessages: ChatMessage[]) => {
    if (!text.trim()) return
    
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setIsLoading(true)
    
    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [
            ...currentMessages.map(m => ({role: m.role, content: m.content})),
            { role: 'user', content: text + (acc ? " (Accessibility mode active: need step-free routing)" : "") }
          ] 
        })
      })
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.text, trace: data.trace_details }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "System temporarily unavailable. Please ask a staff member for assistance." }])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const params = new URLSearchParams(location.search)
    const q = params.get('q')
    const acc = params.get('accessibility') === 'true'
    
    if (acc) {
      setIsAccessible(true)
    }
    
    if (q) {
      sendMessage(q, acc, [])
    }
  }, [location.search])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const userMsg = input
    setInput('')
    await sendMessage(userMsg, isAccessible, messages)
  }

  return (
    <div className="flex-1 flex flex-col bg-mesh relative min-h-screen">
      {/* Top App Bar */}
      <header className="bg-surface sticky top-0 z-50 border-b border-outline-variant flex justify-between items-center w-full px-margin-mobile h-16 max-w-container-max-width mx-auto">
        <div className="flex items-center gap-3">
          <span className="font-headline-md text-headline-md font-bold text-stadium-blue">StadiumPulse</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            aria-label="Toggle Accessibility Mode" 
            className={`p-2 rounded-full transition-colors flex items-center justify-center ${isAccessible ? 'bg-primary-fixed text-stadium-blue' : 'hover:bg-surface-container-high text-on-surface-variant'}`}
            onClick={() => setIsAccessible(!isAccessible)}
          >
            <span className="material-symbols-outlined">{isAccessible ? 'accessible_forward' : 'visibility'}</span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyI716iYn8qkP7P8V1joJksl-Kuj6yLF-d0Rbuym1dGQYRWo-7tlX01UfLRQiw_tJdmPy54JI_PmL366umUHz9ksEV5kt4A1r0JU2diXMau4XMGn0_dzdRJFF6bX5J7mDmiop1Syu_ikFmk4EbKW6p1G_mlIH00lzfbXEKWYBA_zxn2DdjOod5arHqBl7_T-nM9sx35bLJbF6V1xerVDgQU3a5c3fc2-xO7OfD9pSwAwH-PVwDOuT_lZS3N0nIgLryPfYnQ9xOdUk"/>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col max-w-lg mx-auto w-full pb-24">
        <section className="px-margin-mobile pt-6 pb-4">
          {/* Welcome Section (Only show if no messages) */}
          {messages.length === 0 && !isLoading && (
            <>
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container">
                    <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
                  </div>
                  <div>
                    <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Hello!</h1>
                    <p className="text-on-surface-variant font-body-md">I'm your StadiumPulse AI Assistant.</p>
                  </div>
                </div>
                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => sendMessage("Find my seat", isAccessible, messages)} className="flex items-center gap-2 p-3 bg-surface border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all text-left group">
                    <span className="material-symbols-outlined text-stadium-blue group-hover:scale-110 duration-150">event_seat</span>
                    <span className="font-label-caps text-label-caps">Find My Seat</span>
                  </button>
                  <button onClick={() => { setIsAccessible(true); sendMessage("Step-free route to Gate A", true, messages) }} className="flex items-center gap-2 p-3 bg-sensory-calm border border-stadium-blue/10 rounded-lg hover:bg-stadium-blue/5 transition-all text-left group">
                    <span className="material-symbols-outlined text-stadium-blue group-hover:scale-110 duration-150">accessible_forward</span>
                    <span className="font-label-caps text-label-caps">Step-free route</span>
                  </button>
                  <button onClick={() => sendMessage("Where are the restrooms?", isAccessible, messages)} className="flex items-center gap-2 p-3 bg-surface border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all text-left group">
                    <span className="material-symbols-outlined text-stadium-blue group-hover:scale-110 duration-150">wc</span>
                    <span className="font-label-caps text-label-caps">Restrooms</span>
                  </button>
                  <button onClick={() => sendMessage("How do I exit?", isAccessible, messages)} className="flex items-center gap-2 p-3 bg-surface border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all text-left group">
                    <span className="material-symbols-outlined text-stadium-blue group-hover:scale-110 duration-150">logout</span>
                    <span className="font-label-caps text-label-caps">Exit Directions</span>
                  </button>
                </div>
              </div>

              {/* Transit Status Card */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-label-caps text-label-caps flex items-center gap-2">
                    <span className="material-symbols-outlined text-info-blue">directions_transit</span>
                    Live Transit Status
                  </h2>
                  <span className="bg-pitch-green/10 text-pitch-green px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">On Time</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-surface rounded-lg border border-outline-variant/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-stadium-blue flex items-center justify-center text-white font-bold text-xs">M1</div>
                      <div>
                        <p className="font-bold text-sm">Lusail Central</p>
                        <p className="text-xs text-on-surface-variant">Every 4 mins</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="material-symbols-outlined text-pitch-green" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-surface rounded-lg border border-outline-variant/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-alert-orange flex items-center justify-center text-white font-bold text-xs">B22</div>
                      <div>
                        <p className="font-bold text-sm">Fan Zone Shuttle</p>
                        <p className="text-xs text-on-surface-variant">Arriving in 2m</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="material-symbols-outlined text-alert-orange" style={{fontVariationSettings: "'FILL' 1"}}>pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Chat Conversation */}
        <section className="flex-1 px-margin-mobile space-y-4 mb-20" aria-live="polite">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'self-end ml-auto flex-row-reverse' : 'self-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-stadium-blue flex-shrink-0 flex items-center justify-center text-white mt-auto">
                  <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
                </div>
              )}
              <div className="flex flex-col">
                <div className={`p-4 text-sm shadow-sm ${msg.role === 'user' ? 'bg-surface-container-highest text-on-surface rounded-2xl chat-bubble-fan border border-outline-variant' : 'bg-surface-container-lowest text-on-surface rounded-2xl chat-bubble-assistant border border-outline-variant'}`}>
                  <p className="whitespace-pre-wrap leading-relaxed font-body-md">{msg.content}</p>
                </div>
                {msg.trace && msg.trace.length > 0 && (
                  <button 
                    onClick={() => setActiveTrace(msg.trace || [])}
                    className="self-start mt-1 text-xs font-label-caps text-stadium-blue flex items-center gap-1 hover:underline"
                    aria-label="View AI Trace"
                  >
                    <span className="material-symbols-outlined text-[14px]">psychology</span> Grounded ({msg.trace.length} tools)
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 max-w-[85%] self-start">
              <div className="w-8 h-8 rounded-full bg-stadium-blue flex-shrink-0 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-sm animate-pulse-subtle" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-2xl rounded-bl-none text-on-surface-variant text-sm border border-outline-variant shadow-sm flex gap-1">
                <span className="w-2 h-2 rounded-full bg-stadium-blue/50 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-stadium-blue/50 animate-bounce" style={{animationDelay: '0.1s'}}></span>
                <span className="w-2 h-2 rounded-full bg-stadium-blue/50 animate-bounce" style={{animationDelay: '0.2s'}}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </section>
      </main>

      {/* Chat Input Area */}
      <div className="fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant px-margin-mobile py-4 z-40">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-lg mx-auto bg-surface-container-lowest border border-outline-variant rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-stadium-blue/20 transition-all shadow-sm">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..." 
            className="flex-1 bg-transparent border-none text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-0 text-sm font-body-md py-2"
            aria-label="Chat input"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="text-stadium-blue hover:text-primary-container disabled:opacity-30 transition-colors p-1"
            aria-label="Send message"
          >
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
          </button>
        </form>
      </div>

      <TraceDrawer 
        isOpen={activeTrace !== null} 
        onClose={() => setActiveTrace(null)} 
        traceDetails={activeTrace || []} 
      />
    </div>
  )
}

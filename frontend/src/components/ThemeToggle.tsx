import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full hover:bg-surface-dim dark:hover:bg-inverse-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-inverse-primary"
      aria-label="Toggle Theme"
      title="Toggle Theme"
    >
      <span className="material-symbols-outlined text-on-surface dark:text-white">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  )
}

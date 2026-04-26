import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { label: 'Dashboard', to: '/dashboard' },
]

export default function Navbar() {
  const { user, signOut } = useAuth()
  const loc = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-base/80 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber flex items-center justify-center text-base font-display font-800 text-sm">T</span>
          <span className="font-display font-700 text-slate-bright tracking-tight text-lg">TaskFlow</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(n => (
            <Link
              key={n.to} to={n.to}
              className={`px-4 py-2 rounded-lg text-sm font-display font-600 transition-colors
                ${loc.pathname === n.to
                  ? 'bg-card text-amber border border-border'
                  : 'text-slate-soft hover:text-slate-bright'}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs text-slate-soft font-mono truncate max-w-[160px]">{user?.email}</span>
          <button onClick={signOut} className="btn-ghost text-xs py-1.5 px-3">Sign out</button>
        </div>
      </div>
    </header>
  )
}
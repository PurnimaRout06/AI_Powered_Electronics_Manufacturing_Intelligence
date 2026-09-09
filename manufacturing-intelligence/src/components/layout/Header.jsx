import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Header({ title, breadcrumb }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = user?.name
    ? user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
    : '—'

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-surface-border bg-white/80 backdrop-blur px-6">
      <div>
        <p className="text-[13px] text-ink-muted">{breadcrumb}</p>
        <h1 className="text-[15px] font-semibold text-ink leading-none mt-0.5">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 h-9 w-56 rounded-lg border border-surface-border bg-surface-bg px-3 text-sm text-ink-muted focus-within:border-primary focus-within:bg-white transition-colors">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-full text-ink placeholder:text-ink-muted"
          />
        </div>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-slate-100 hover:text-ink transition-colors">
          <Bell size={17} />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-status-critical" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-surface-border px-3 py-1.5 text-xs font-medium text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
          System Operational
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 hover:bg-slate-100 transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-primary-light flex items-center justify-center text-[11px] font-semibold text-primary-dark">
              {initials}
            </div>
            <ChevronDown size={14} className="text-ink-muted" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-1.5 w-48 rounded-lg border border-surface-border bg-white shadow-raised py-1 animate-fadeIn z-20">
              <div className="px-3 py-2 border-b border-surface-border">
                <p className="text-xs font-medium text-ink truncate">{user?.name}</p>
                <p className="text-[11px] text-ink-muted truncate">{user?.email}</p>
              </div>
              <button onClick={() => navigate('/preferences')} className="w-full text-left px-3 py-2 text-sm text-ink hover:bg-slate-50">
                Preferences
              </button>
              <div className="my-1 border-t border-surface-border" />
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-status-critical hover:bg-slate-50">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

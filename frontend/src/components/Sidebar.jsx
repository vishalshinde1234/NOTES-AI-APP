import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FileText, Sparkles, LogOut, Plus } from 'lucide-react'

export default function Sidebar({ activePanel, setActivePanel, user, onNewNote }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { id: 'notes', icon: FileText, label: 'Notes' },
    { id: 'ai', icon: Sparkles, label: 'AI Assistant' },
  ]

  return (
    <div className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 gap-2">
      {/* Logo */}
      <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* New Note */}
      <button
        onClick={onNewNote}
        className="w-9 h-9 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 rounded-lg flex items-center justify-center text-indigo-400 hover:text-indigo-300 transition-all mb-2"
        title="New Note"
      >
        <Plus size={16} />
      </button>

      {/* Nav */}
      <div className="flex flex-col gap-1 flex-1">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActivePanel(id)}
            title={label}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              activePanel === id
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>

      {/* User Avatar + Logout */}
      <div className="flex flex-col items-center gap-2 mt-auto">
        <div className="w-8 h-8 bg-indigo-600/30 border border-indigo-500/30 rounded-full flex items-center justify-center">
          <span className="text-indigo-300 text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={15} />
        </button>
      </div>
    </div>
  )
}
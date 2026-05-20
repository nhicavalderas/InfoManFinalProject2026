import { Menu, LogOut, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ onMenuClick, onLogout }) {
  const { userRow, user } = useAuth()

  const displayName = userRow?.username || 
    user?.email?.split('@')[0] || 
    'HR Staff'

  const displayRole = userRow?.user_type || 'USER'

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 shadow-sm">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-200">
          <div className="w-6 h-6 bg-hope-100 rounded-lg flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-hope-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 leading-tight">{displayName}</span>
            <span className="text-xs text-hope-600 font-medium leading-tight">{displayRole}</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-150"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
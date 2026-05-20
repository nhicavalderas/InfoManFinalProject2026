import { Users, Clock, Briefcase, Building2, Shield, Trash2, BarChart2 } from 'lucide-react'
import { useRights } from '../../hooks/useRights'

const NAV_ITEMS = [
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'jobhistory', label: 'Job History', icon: Clock },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'reports', label: 'Reports', icon: BarChart2 },
  { id: 'admin', label: 'Admin', icon: Shield, adminOnly: true },
  { id: 'deleted-items', label: 'Deleted Items', icon: Trash2, adminOnly: true },
]

export default function Sidebar({ currentPage, onNavigate, isOpen, onClose }) {
  const { isAdmin } = useRights()

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />
      )}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-56 bg-hope-950 text-white flex flex-col
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-hope-800">
          <div className="w-9 h-9 bg-hope-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">Hope HR</p>
            <p className="text-hope-400 text-xs">Human Resource System</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon, adminOnly }) => {
            if (adminOnly && !isAdmin) return null
            const isActive = currentPage === id || currentPage.startsWith(id)
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left
                  ${isActive
                    ? 'bg-hope-600 text-white shadow-lg shadow-hope-900/50'
                    : 'text-hope-300 hover:bg-hope-800 hover:text-white'
                  }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </button>
            )
          })}
        </nav>

        <div className="px-4 py-3 border-t border-hope-800">
          <p className="text-xs text-hope-500 font-medium">Hope HR System</p>
          <p className="text-xs text-hope-600 mt-0.5">{isAdmin ? 'Admin Access' : 'User Access'}</p>
        </div>
      </aside>
    </>
  )
}
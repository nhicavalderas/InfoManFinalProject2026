import { 
  Users, 
  Briefcase, 
  Building2, 
  Clock, 
  Shield, 
  Trash2, 
  ChevronRight 
} from 'lucide-react'

const menuItems = [
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'jobhistory', label: 'Job History', icon: Clock },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'departments', label: 'Departments', icon: Building2 },
  // TODO: M4 — show only if rights.ADM_USER === 1
  { id: 'admin', label: 'Admin', icon: Shield, adminOnly: true },
  // TODO: M4 — show only if user_type !== 'USER'
  { id: 'deleted', label: 'Deleted Items', icon: Trash2, adminOnly: true },
]

export default function Sidebar({ currentPage, onNavigate, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-200 lg:hidden">
          <h2 className="font-bold text-gray-900">Hope HR</h2>
        </div>
        
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id)
                  onClose()
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                  ${item.adminOnly ? 'opacity-75' : ''}
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4 text-blue-600" />}
              </button>
            )
          })}
        </nav>
        
        {/* Admin badge for visual distinction */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
            <p className="font-medium text-gray-700 mb-1">Sprint 1 Preview</p>
            <p>Some links are gated for admin users only.</p>
          </div>
        </div>
      </aside>
    </>
  )
}
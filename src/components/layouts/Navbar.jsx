import { LogOut, Menu, User } from 'lucide-react'
import Button from '../common/Button'

export default function Navbar({ userName = 'HR Staff', onMenuClick, onLogout }) {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={onMenuClick}
            className="lg:hidden p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Hope HR</h1>
              <p className="text-xs text-gray-500">Human Resource System</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            <div className="bg-gray-100 p-1.5 rounded-full">
              <User className="h-4 w-4" />
            </div>
            <span className="font-medium">{userName}</span>
          </div>
          
          <Button variant="ghost" onClick={onLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
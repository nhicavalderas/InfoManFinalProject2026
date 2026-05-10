import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import AppShell from './components/layouts/AppShell'
import EmployeeListPage from './pages/EmployeeListPage'
import JobHistoryPage from './pages/JobHistoryPage'
import JobsPage from './pages/JobsPage'
import DepartmentsPage from './pages/DepartmentsPage'
import AdminPage from './pages/AdminPage'
import DeletedItemsPage from './pages/DeletedItemsPage'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
    setCurrentPage('employees')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentPage('login')
  }

  const navigate = (page) => setCurrentPage(page)

  if (!isAuthenticated) {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={navigate} />
      case 'register':
        return <RegisterPage onNavigate={navigate} />
      case 'callback':
        return <AuthCallbackPage onComplete={handleLogin} />
      default:
        return <LoginPage onLogin={handleLogin} onNavigate={navigate} />
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'employees': return <EmployeeListPage />
      case 'jobhistory': return <JobHistoryPage />
      case 'jobs': return <JobsPage />
      case 'departments': return <DepartmentsPage />
      case 'admin': return <AdminPage />
      case 'deleted': return <DeletedItemsPage />
      default: return <EmployeeListPage />
    }
  }

  return (
    <AppShell 
      currentPage={currentPage} 
      onNavigate={navigate} 
      onLogout={handleLogout}
    >
      {renderPage()}
    </AppShell>
  )
}

export default App
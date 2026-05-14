import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppShell from './components/layouts/AppShell'

// M2's full pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import EmployeeListPage from './pages/EmployeeListPage'
import EmployeeDetailPage from './pages/EmployeeDetailPage'
import JobHistoryPage from './pages/JobHistoryPage'
import JobsPage from './pages/JobsPage'
import DepartmentsPage from './pages/DepartmentsPage'
import AdminPage from './pages/AdminPage'
import DeletedItemsPage from './pages/DeletedItemsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/employees" element={<EmployeeListPage />} />
            <Route path="/employees/:empno" element={<EmployeeDetailPage />} />
            <Route path="/jobhistory" element={<JobHistoryPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/deleted-items" element={<DeletedItemsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
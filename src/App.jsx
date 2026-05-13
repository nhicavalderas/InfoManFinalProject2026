import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import AuthCallback from './pages/AuthCallback'
import Employees from './pages/Employees'
import JobHistory from './pages/JobHistory'
import Jobs from './pages/Jobs'
import Departments from './pages/Departments'
import Admin from './pages/Admin'
import DeletedItems from './pages/DeletedItems'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/employees" element={<Employees />} />
          <Route path="/jobhistory" element={<JobHistory />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/deleted-items" element={<DeletedItems />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
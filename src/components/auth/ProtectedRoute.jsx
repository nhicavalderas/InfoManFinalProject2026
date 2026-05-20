import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute() {
  const { userRow, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <div>Loading...</div>
  if (!userRow) return <Navigate to="/login" replace />

  const userType = userRow?.user_type || 'USER'

  if (location.pathname === '/deleted-items' && userType === 'USER') {
    return <Navigate to="/employees" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../../services/api'

function ProtectedRoute() {
  const [session, setSession] = useState(undefined)
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return <div>Loading...</div>

  if (!session) return <Navigate to="/login" replace />

  // Route guard: redirect USER type away from /deleted-items
  // TODO: Replace 'USER' check with useRights() once M4 completes AuthContext
  const userType = session?.user?.user_metadata?.user_type || 'USER'
  if (location.pathname === '/deleted-items' && userType === 'USER') {
    return <Navigate to="/employees" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../../services/api'

function ProtectedRoute() {
  const [session, setSession] = useState(undefined)
  const [userType, setUserType] = useState(null)
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session?.user?.email) {
        const { data } = await supabase
          .from('user')
          .select('user_type')
          .eq('email', session.user.email)
          .single()
        setUserType(data?.user_type || 'USER')
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session?.user?.email) {
        const { data } = await supabase
          .from('user')
          .select('user_type')
          .eq('email', session.user.email)
          .single()
        setUserType(data?.user_type || 'USER')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined || (session && userType === null)) return <div>Loading...</div>
  if (!session) return <Navigate to="/login" replace />

  if (location.pathname === '/deleted-items' && userType === 'USER') {
    return <Navigate to="/employees" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
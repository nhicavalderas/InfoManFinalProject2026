/**
 * AuthContext.jsx - Authentication Context for Hope HR System
 * Author: M4 - Rights & Auth Specialist
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userRow, setUserRow] = useState(null)
  const [rights, setRights] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  async function loadUserData(session) {
    if (!session) { 
      setUser(null); 
      setUserRow(null); 
      setRights({});
      setIsLoading(false); 
      return 
    }

    const { data: row } = await supabase.from('user')
      .select('*').eq('userId', session.user.id).single()

    if (!row || row.record_status !== 'ACTIVE') {
      await supabase.auth.signOut()
      alert('Your account is not yet activated. Contact your admin.')
      setIsLoading(false); 
      return
    }

    const { data: rightsRows } = await supabase.from('UserModule_Rights')
      .select('rightId, right_value').eq('userId', session.user.id)

    const rightsMap = {}
    rightsRows?.forEach(r => { rightsMap[r.rightId] = r.right_value === 1 })

    setUser(session.user)
    setUserRow(row)
    setRights(rightsMap)
    setIsLoading(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => loadUserData(session))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUserData(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = (email, password) => supabase.auth.signInWithPassword({ email, password })
  const signUp = (email, password, meta) => supabase.auth.signUp({ 
    email, password, options: { data: meta } 
  })
  const loginWithGoogle = () => supabase.auth.signInWithOAuth({ 
    provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } 
  })
  const logout = () => supabase.auth.signOut()

  const value = {
    user,
    userRow,
    rights,
    isLoading,
    isAuthenticated: !!user,
    login,
    signUp,
    loginWithGoogle,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
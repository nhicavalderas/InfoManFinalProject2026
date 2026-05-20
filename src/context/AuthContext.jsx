/**
 * AuthContext.jsx - Authentication Context for Hope HR System
 * Author: M4 - Rights & Auth Specialist
 * Date: May 2026
 * 
 * PURPOSE:
 * - Provides global auth state to the entire React app
 * - Manages user session (login, logout, signup, Google OAuth)
 * - Loads user's 17 rights from UserModule_Rights table
 * - Implements login guard (only ACTIVE users can log in)
 * 
 * HOW TO USE:
 * - Wrap your app with <AuthProvider>
 * - Use useAuth() hook in any component to access user and auth functions
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../services/api'

// Create the context object that components will consume
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // ========== STATE VARIABLES ==========
  const [user, setUser] = useState(null)           // Raw Supabase auth user
  const [userRow, setUserRow] = useState(null)     // Our custom user table row (has user_type, status)
  const [rights, setRights] = useState({})         // Map of rightId -> boolean (true/false)
  const [isLoading, setIsLoading] = useState(true) // Show loading spinner while checking auth

  /**
   * loadUserData - Fetches user data and rights from Supabase
   * Called whenever auth session changes (login, logout, token refresh)
   * @param {object} session - Supabase auth session (null if logged out)
   */
  async function loadUserData(session) {
    // CASE 1: No session = user is logged out
    if (!session) { 
      setUser(null); 
      setUserRow(null); 
      setRights({});
      setIsLoading(false); 
      return 
    }

    // CASE 2: User is logged in - fetch their data from our 'user' table
    const { data: row } = await supabase.from('user')
      .select('*').eq('userid', session.user.id).single()

    // LOGIN GUARD: Check if user exists AND is ACTIVE
    if (!row || row.record_status !== 'ACTIVE') {
      // INACTIVE users cannot log in - sign them out immediately
      await supabase.auth.signOut()
      alert('Your account is not yet activated. Contact your admin.')
      setIsLoading(false); 
      return
    }

    // Fetch user's rights from UserModule_Rights table (all 17 rights)
    const { data: rightsRows } = await supabase.from('UserModule_Rights')
      .select('rightId, right_value').eq('userId', session.user.id)

    // Convert rights array to a map for O(1) lookup: { EMP_VIEW: true, EMP_ADD: false, ... }
    const rightsMap = {}
    rightsRows?.forEach(r => { rightsMap[r.rightId] = r.right_value === 1 })

    // Update state with user data and rights
    setUser(session.user)
    setUserRow(row)
    setRights(rightsMap)
    setIsLoading(false)
  }

  /**
   * useEffect - Set up auth state listener
   * Runs once when component mounts
   * Listens for login/logout/session changes
   */
  useEffect(() => {
    // Check for existing session on app load
    supabase.auth.getSession().then(({ data: { session } }) => loadUserData(session))

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUserData(session)
    })

    // Cleanup subscription when component unmounts
    return () => subscription.unsubscribe()
  }, [])

  // ========== AUTH FUNCTIONS ==========
  const login = (email, password) => supabase.auth.signInWithPassword({ email, password })
  
  const signUp = (email, password, meta) => supabase.auth.signUp({ 
    email, password, options: { data: meta } 
  })
  
  const loginWithGoogle = () => supabase.auth.signInWithOAuth({ 
    provider: 'google', 
    options: { redirectTo: window.location.origin + '/auth/callback' } 
  })
  
  const logout = () => supabase.auth.signOut()

  // ========== PROVIDER RETURN ==========
  const value = {
    user,           // Supabase auth user object
    userRow,        // Custom user row (user_type, record_status, etc.)
    rights,         // Map of 17 rights (boolean values)
    isLoading,      // Loading state for showing spinners
    isAuthenticated: !!user,  // True if user is logged in
    login,          // Email/password login function
    signUp,         // Email/password registration function
    loginWithGoogle,// Google OAuth login function
    logout          // Logout function
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * useAuth - Custom hook to access auth context
 * Usage: const { user, login, logout } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
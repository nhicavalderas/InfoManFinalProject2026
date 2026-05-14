import { createContext, useContext, useState } from 'react'

// TODO: M4 — Implement full auth context with Supabase
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    // TODO: M4 — Add login, logout, signUp functions
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
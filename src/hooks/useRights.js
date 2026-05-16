/**
 * useRights.js - Custom Hook for Rights/Permissions Checking
 * Author: M4 - Rights & Auth Specialist
 */

import { useAuth } from '../context/AuthContext'

export function useRights() {
  const { rights, userRow } = useAuth()
  
  const userType = userRow?.user_type || 'USER'
  const hasRight = (key) => rights[key] === true
  const isAdmin = userType === 'ADMIN' || userType === 'SUPERADMIN'
  const isSuperAdmin = userType === 'SUPERADMIN'
  
  return { rights, userType, hasRight, isAdmin, isSuperAdmin }
}
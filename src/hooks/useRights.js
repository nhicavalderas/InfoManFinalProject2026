/**
 * useRights.js - Custom Hook for Rights/Permissions Checking
 * Author: M4 - Rights & Auth Specialist
 * Date: May 2026
 * 
 * PURPOSE:
 * - Provides easy access to user's rights throughout the app
 * - Gated UI components (buttons, links, columns) use hasRight()
 * 
 * HOW TO USE:
 *   const { hasRight, userType, isAdmin } = useRights()
 *   {hasRight('EMP_ADD') && <AddButton />}
 *   {userType !== 'USER' && <AdminLink />}
 */

import { useAuth } from '../context/AuthContext'

export function useRights() {
  // Get rights map and user row from AuthContext
  const { rights, userRow } = useAuth()
  
  /**
   * userType - Role of logged-in user
   * Possible values: 'USER', 'ADMIN', 'SUPERADMIN'
   * Defaults to 'USER' if no user is logged in
   */
  const userType = userRow?.user_type || 'USER'
  
  /**
   * hasRight - Check if user has a specific right
   * @param {string} key - Right ID (e.g., 'EMP_ADD', 'EMP_VIEW', 'ADM_USER')
   * @returns {boolean} - True if user has the right
   * 
   * Example: hasRight('EMP_ADD') returns true for ADMIN/SUPERADMIN, false for USER
   */
  const hasRight = (key) => rights[key] === true
  
  /**
   * isAdmin - Helper boolean
   * True for ADMIN and SUPERADMIN (both can see Deleted Items, manage users)
   */
  const isAdmin = userType === 'ADMIN' || userType === 'SUPERADMIN'
  
  /**
   * isSuperAdmin - Helper boolean
   * True ONLY for SUPERADMIN (only they can soft-delete records)
   */
  const isSuperAdmin = userType === 'SUPERADMIN'
  
  // Return all rights-related data and helpers
  return { 
    rights,      // Full rights map object (all 17 rights with boolean values)
    userType,    // 'USER', 'ADMIN', or 'SUPERADMIN'
    hasRight,    // Function to check individual rights
    isAdmin,     // Boolean - ADMIN or SUPERADMIN
    isSuperAdmin // Boolean - SUPERADMIN only
  }
}
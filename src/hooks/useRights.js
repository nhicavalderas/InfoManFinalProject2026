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
 * 
 * RIGHTS LOGIC BY ROLE:
 * - USER      → view only (_VIEW rights only)
 * - ADMIN     → view + add + edit (no _DEL rights)
 * - SUPERADMIN → full access (all rights including _DEL)
 */

import { useAuth } from '../context/AuthContext'

export function useRights() {
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
   * Logic is based on user_type directly so changing role in the
   * database instantly reflects in the UI without needing to
   * manually update UserModule_Rights rows per user.
   * 
   * SUPERADMIN → all rights
   * ADMIN      → everything except _DEL rights
   * USER       → only _VIEW rights
   */
  const hasRight = (key) => {
    if (userType === 'SUPERADMIN') return true
    if (userType === 'ADMIN') {
      if (key.endsWith('_DEL')) return false
      return true
    }
    if (userType === 'USER') {
      if (key.endsWith('_VIEW')) return true
      return false
    }
    return false
  }

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

  return {
    rights,       // Full rights map object from DB (kept for reference)
    userType,     // 'USER', 'ADMIN', or 'SUPERADMIN'
    hasRight,     // Function to check individual rights (now role-based)
    isAdmin,      // Boolean - ADMIN or SUPERADMIN
    isSuperAdmin  // Boolean - SUPERADMIN only
  }
}
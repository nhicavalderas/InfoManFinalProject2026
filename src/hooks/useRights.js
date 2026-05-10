import { useState, useEffect } from 'react'

// TODO: M4 — Fetch from UserModule_Rights table on login
export function useRights() {
  const [rights, setRights] = useState({
    EMP_VIEW: false, EMP_ADD: false, EMP_EDIT: false, EMP_DEL: false,
    JH_VIEW: false, JH_ADD: false, JH_EDIT: false, JH_DEL: false,
    JOB_VIEW: false, JOB_ADD: false, JOB_EDIT: false, JOB_DEL: false,
    DEPT_VIEW: false, DEPT_ADD: false, DEPT_EDIT: false, DEPT_DEL: false,
    ADM_USER: false
  })

  const [userType, setUserType] = useState('USER') // 'USER', 'ADMIN', 'SUPERADMIN'

  // TODO: M4 — Query UserModule_Rights on auth state change
  useEffect(() => {
    // Placeholder: In production, fetch from Supabase
    console.log('Rights hook initialized — M4 will wire this')
  }, [])

  const hasRight = (rightCode) => rights[rightCode] === true

  return {
    rights,
    userType,
    hasRight,
    isAdmin: userType === 'ADMIN' || userType === 'SUPERADMIN',
    isSuperAdmin: userType === 'SUPERADMIN'
  }
}
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)

// TODO: M1 — Employee API functions
export const employeeApi = {
  getAll: async (userType) => {
    // TODO: Filter by record_status if userType === 'USER'
    console.log('getEmployees called with:', userType)
    return []
  },
  add: async (data) => { console.log('addEmployee:', data) },
  update: async (empno, data) => { console.log('updateEmployee:', empno, data) },
  softDelete: async (empno, userId) => { console.log('softDeleteEmployee:', empno, userId) },
  recover: async (empno, userId) => { console.log('recoverEmployee:', empno, userId) }
}

// TODO: M1 — Job History API functions
export const jobHistoryApi = {
  getByEmployee: async (empNo, userType) => { return [] },
  add: async (data) => {},
  update: async (data) => {},
  softDelete: async (empNo, jobCode, effDate) => {},
  recover: async (empNo, jobCode, effDate) => {}
}

// TODO: M1 — Job API functions
export const jobApi = {
  getAll: async (userType) => { return [] },
  add: async (data) => {},
  update: async (jobCode, data) => {},
  softDelete: async (jobCode, userId) => {},
  recover: async (jobCode, userId) => {}
}

// TODO: M1 — Department API functions
export const deptApi = {
  getAll: async (userType) => { return [] },
  add: async (data) => {},
  update: async (deptCode, data) => {},
  softDelete: async (deptCode, userId) => {},
  recover: async (deptCode, userId) => {}
}

// TODO: M1 — Admin API functions
export const adminApi = {
  getUsers: async () => { return [] },
  activateUser: async (userId) => {},
  deactivateUser: async (userId) => {}
}
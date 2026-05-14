import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)

// TODO: M1 — Employee API functions
export const employeeApi = {
  getAll: async (userType) => {
    let query = supabase.from('employee').select('*')
    if (userType === 'USER') query = query.eq('record_status', 'ACTIVE')
    const { data, error } = await query
    if (error) throw error
    return data
  },
  add: async (data) => {
    const { error } = await supabase.from('employee').insert(data)
    if (error) throw error
  },
  update: async (empno, data) => {
    const { error } = await supabase.from('employee').update(data).eq('empno', empno)
    if (error) throw error
  },
  softDelete: async (empno, stamp) => {
    const { error } = await supabase.from('employee')
      .update({ record_status: 'INACTIVE', stamp }).eq('empno', empno)
    if (error) throw error
  },
  recover: async (empno, stamp) => {
    const { error } = await supabase.from('employee')
      .update({ record_status: 'ACTIVE', stamp }).eq('empno', empno)
    if (error) throw error
  },
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
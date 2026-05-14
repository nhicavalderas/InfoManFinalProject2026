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
  getByEmployee: async (empNo, userType) => {
    let query = supabase.from('jobhistory').select('*').eq('empno', empNo)
    if (userType === 'USER') query = query.eq('record_status', 'ACTIVE')
    const { data, error } = await query
    if (error) throw error
    return data
  },
  add: async (data) => {
    const { error } = await supabase.from('jobhistory').insert(data)
    if (error) throw error
  },
  update: async (data) => {
    const { error } = await supabase.from('jobhistory')
      .update(data).eq('empno', data.empno).eq('jobcode', data.jobcode).eq('effdate', data.effdate)
    if (error) throw error
  },
  softDelete: async (empNo, jobCode, effDate, stamp) => {
    const { error } = await supabase.from('jobhistory')
      .update({ record_status: 'INACTIVE', stamp })
      .eq('empno', empNo).eq('jobcode', jobCode).eq('effdate', effDate)
    if (error) throw error
  },
  recover: async (empNo, jobCode, effDate, stamp) => {
    const { error } = await supabase.from('jobhistory')
      .update({ record_status: 'ACTIVE', stamp })
      .eq('empno', empNo).eq('jobcode', jobCode).eq('effdate', effDate)
    if (error) throw error
  },
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
  getUsers: async () => {
    const { data, error } = await supabase.from('user')
      .select('*').neq('user_type', 'SUPERADMIN')
    if (error) throw error
    return data
  },
  activateUser: async (userId) => {
    const { error } = await supabase.from('user')
      .update({ record_status: 'ACTIVE' })
      .eq('userId', userId).neq('user_type', 'SUPERADMIN')
    if (error) throw error
  },
  deactivateUser: async (userId) => {
    const { error } = await supabase.from('user')
      .update({ record_status: 'INACTIVE' })
      .eq('userId', userId).neq('user_type', 'SUPERADMIN')
    if (error) throw error
  },
}
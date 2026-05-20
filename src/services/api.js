import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)

// TODO: M1 — Employee API functions
export const employeeApi = {
  getAll: async (userType) => {
    let query = supabase.from('employee_current_job').select('*')
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
  getAll: async () => {
    const { data, error } = await supabase.from('jobhistory').select('*').eq('record_status', 'ACTIVE')
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
  getAll: async (userType) => {
    let query = supabase.from('job').select('*')
    if (userType === 'USER') query = query.eq('record_status', 'ACTIVE')
    const { data, error } = await query
    if (error) throw error
    return data
  },
  add: async (data) => {
    const { error } = await supabase.from('job').insert(data)
    if (error) throw error
  },
  update: async (jobCode, data) => {
    const { error } = await supabase.from('job').update(data).eq('jobcode', jobCode)
    if (error) throw error
  },
  softDelete: async (jobCode, stamp) => {
    const { error } = await supabase.from('job')
      .update({ record_status: 'INACTIVE', stamp }).eq('jobcode', jobCode)
    if (error) throw error
  },
  recover: async (jobCode, stamp) => {
    const { error } = await supabase.from('job')
      .update({ record_status: 'ACTIVE', stamp }).eq('jobcode', jobCode)
    if (error) throw error
  },
}

// TODO: M1 — Department API functions
export const deptApi = {
  getAll: async (userType) => {
    let query = supabase.from('department').select('*')
    if (userType === 'USER') query = query.eq('record_status', 'ACTIVE')
    const { data, error } = await query
    if (error) throw error
    return data
  },
  add: async (data) => {
    const { error } = await supabase.from('department').insert(data)
    if (error) throw error
  },
  update: async (deptCode, data) => {
    const { error } = await supabase.from('department').update(data).eq('deptcode', deptCode)
    if (error) throw error
  },
  softDelete: async (deptCode, stamp) => {
    const { error } = await supabase.from('department')
      .update({ record_status: 'INACTIVE', stamp }).eq('deptcode', deptCode)
    if (error) throw error
  },
  recover: async (deptCode, stamp) => {
    const { error } = await supabase.from('department')
      .update({ record_status: 'ACTIVE', stamp }).eq('deptcode', deptCode)
    if (error) throw error
  },
}
// TODO: M1 — Admin API functions
export const adminApi = {
  getUsers: async () => {
    const { data, error } = await supabase.from('user')
      .select('*').neq('user_type', 'SUPERADMIN')
    if (error) throw error
    return data
  },
  activateUser: async (userid) => {
    const { error } = await supabase.from('user')
      .update({ record_status: 'ACTIVE' })
      .eq('userid', userid).neq('user_type', 'SUPERADMIN')
    if (error) throw error
  },
  deactivateUser: async (userid) => {
    const { error } = await supabase.from('user')
      .update({ record_status: 'INACTIVE' })
      .eq('userid', userid).neq('user_type', 'SUPERADMIN')
    if (error) throw error
  },
}
// TODO: M1 — Reports API functions
export const reportsApi = {
  getHeadcountByDept: async () => {
    const { data, error } = await supabase.from('headcount_by_dept').select('*')
    if (error) throw error
    return data
  },
  getSalarySummaryByJob: async () => {
    const { data, error } = await supabase.from('salary_summary_by_job').select('*')
    if (error) throw error
    return data
  },
  getEmployeeFullHistory: async (empNo) => {
    const { data, error } = await supabase.from('jobhistory')
      .select('*').eq('empno', empNo)
    if (error) throw error
    return data
  },
}
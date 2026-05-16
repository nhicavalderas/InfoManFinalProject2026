import { useState, useEffect } from 'react'
import Table from '../components/common/Table'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { adminApi } from '../services/api'
import { UserCheck, UserX, Shield, Users } from 'lucide-react'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => { loadUsers() }, [])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await adminApi.getUsers()
      setUsers(data || [])
    } catch (err) {
      setError('Failed to load users: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleActivate = async (user) => {
    try {
      setActionLoading(user.userId)
      await adminApi.activateUser(user.userId)
      await loadUsers()
    } catch (err) {
      alert('Error activating user: ' + err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeactivate = async (user) => {
    try {
      setActionLoading(user.userId)
      await adminApi.deactivateUser(user.userId)
      await loadUsers()
    } catch (err) {
      alert('Error deactivating user: ' + err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const stats = {
    total: users.length,
    active: users.filter(u => u.record_status === 'ACTIVE').length,
    inactive: users.filter(u => u.record_status === 'INACTIVE').length,
    admins: users.filter(u => u.user_type === 'ADMIN' || u.user_type === 'SUPERADMIN').length,
  }

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    {
      key: 'user_type', label: 'Role',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          row.user_type === 'SUPERADMIN' ? 'bg-purple-100 text-purple-700' :
          row.user_type === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-600'
        }`}>
          {row.user_type}
        </span>
      )
    },
    {
      key: 'record_status', label: 'Status',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          row.record_status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
        }`}>
          {row.record_status}
        </span>
      )
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => {
        if (row.user_type === 'SUPERADMIN') return <span className="text-xs text-gray-400">Protected</span>
        const isActing = actionLoading === row.userId
        return row.record_status === 'ACTIVE' ? (
          <button
            onClick={() => handleDeactivate(row)}
            disabled={isActing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <UserX className="h-3.5 w-3.5" />
            {isActing ? 'Processing...' : 'Deactivate'}
          </button>
        ) : (
          <button
            onClick={() => handleActivate(row)}
            disabled={isActing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <UserCheck className="h-3.5 w-3.5" />
            {isActing ? 'Processing...' : 'Activate'}
          </button>
        )
      }
    }
  ]

  if (isLoading) return <div className="py-12"><LoadingSpinner text="Loading users..." /></div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <p className="text-gray-500">Manage user accounts and access control</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', value: stats.total, icon: Users, color: 'bg-blue-50 text-blue-600' },
          { label: 'Active', value: stats.active, icon: UserCheck, color: 'bg-green-50 text-green-600' },
          { label: 'Inactive', value: stats.inactive, icon: UserX, color: 'bg-red-50 text-red-600' },
          { label: 'Admins', value: stats.admins, icon: Shield, color: 'bg-purple-50 text-purple-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error} <button onClick={loadUsers} className="underline ml-2">Retry</button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">User Accounts</h2>
          <p className="text-sm text-gray-500">Activate or deactivate user access to the system</p>
        </div>
        <div className="p-4">
          <Table columns={columns} data={users}
            emptyMessage="No users found" keyExtractor={r => r.userId} />
        </div>
      </div>
    </div>
  )
}
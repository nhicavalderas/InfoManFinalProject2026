import { useState, useEffect } from 'react'
import Table from '../components/common/Table'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { useNavigate } from 'react-router-dom'
import Input from '../components/common/Input'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { employeeApi } from '../services/api'
import { useRights } from '../hooks/useRights'

const EMPTY_FORM = { 
  empno: '', lastname: '', firstname: '', middlename: '', 
  address: '', birthdate: '', hiredate: '', 
  gender: 'M', status: 'REGULAR'
}

export default function EmployeeListPage() {
  const navigate = useNavigate()
  const { hasRight, isAdmin } = useRights()
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => { loadEmployees() }, [])

  const loadEmployees = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await employeeApi.getAll()
      setEmployees(data || [])
    } catch (err) {
      setError('Failed to load employees: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = employees.filter(e =>
    e.lastname?.toLowerCase().includes(search.toLowerCase()) ||
    e.firstname?.toLowerCase().includes(search.toLowerCase()) ||
    e.empno?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0
    const av = a[sortKey] ?? ''
    const bv = b[sortKey] ?? ''
    return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
  })

  const SortLabel = ({ col, label }) => (
    <span onClick={() => handleSort(col)} className="cursor-pointer hover:text-hope-600 select-none">
      {label} {sortKey === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  )

  const handleAdd = () => { setEditTarget(null); setForm(EMPTY_FORM); setShowModal(true) }
  const handleEdit = (row) => { setEditTarget(row); setForm({ ...row }); setShowModal(true) }
  const handleDelete = (row) => { setDeleteTarget(row); setShowConfirm(true) }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      if (editTarget) { await employeeApi.update(editTarget.empno, form) }
      else { await employeeApi.add(form) }
      await loadEmployees()
      setShowModal(false)
    } catch (err) {
      alert('Error saving: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await employeeApi.softDelete(deleteTarget.empno)
      await loadEmployees()
      setShowConfirm(false)
    } catch (err) {
      alert('Error deleting: ' + err.message)
    }
  }

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))
  })

  const columns = [
    { key: 'empno', label: <SortLabel col="empno" label="Emp No." /> },
    { key: 'lastname', label: <SortLabel col="lastname" label="Last Name" /> },
    { key: 'firstname', label: <SortLabel col="firstname" label="First Name" /> },
    { key: 'deptcode', label: <SortLabel col="deptcode" label="Department" /> },
    { key: 'jobcode', label: <SortLabel col="jobcode" label="Job Code" /> },
    {
      key: 'record_status', label: 'Status',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          row.record_status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>{row.record_status}</span>
      )
    },
    ...(isAdmin ? [{
      key: 'stamp', label: 'Last Modified By',
      render: (row) => <span className="text-xs text-gray-400">{row.stamp || '—'}</span>
    }] : []),
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {hasRight('EMP_EDIT') && (
            <button onClick={(e) => { e.stopPropagation(); handleEdit(row) }} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {hasRight('EMP_DEL') && (
            <button onClick={(e) => { e.stopPropagation(); handleDelete(row) }} className="p-1 text-red-600 hover:bg-red-50 rounded">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    }
  ]

  if (isLoading) return <div className="py-12"><LoadingSpinner text="Loading employees..." /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500">Manage employee records</p>
        </div>
        {hasRight('EMP_ADD') && (
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Employee
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error} <button onClick={loadEmployees} className="underline ml-2">Retry</button>
        </div>
      )}

      <div className="mb-4">
        <input type="text" placeholder="Search by name or employee number..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
      </div>

      <Table columns={columns} data={sorted} emptyMessage="No employees found"
        keyExtractor={r => r.empno} onRowClick={(row) => navigate(`/employees/${row.empno}`)} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editTarget ? 'Edit Employee' : 'Add Employee'}
        footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={handleSave} isLoading={isSaving}>Save</Button></>}>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Employee No." id="empno" {...field('empno')} required />
          <Input label="Last Name" id="lastname" {...field('lastname')} required />
          <Input label="First Name" id="firstname" {...field('firstname')} required />
          <Input label="Middle Name" id="middlename" {...field('middlename')} />
          <Input label="Birth Date" id="birthdate" type="date" {...field('birthdate')} />
          <Input label="Hire Date" id="hiredate" type="date" {...field('hiredate')} />
          <div className="col-span-2"><Input label="Address" id="address" {...field('address')} /></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select {...field('gender')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select {...field('status')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option value="REGULAR">Regular</option>
              <option value="PROBATIONARY">Probationary</option>
              <option value="CONTRACTUAL">Contractual</option>
            </select>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Delete" size="sm"
        footer={<><Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button><Button variant="danger" onClick={handleConfirmDelete}>Delete</Button></>}>
        <p className="text-gray-600">Are you sure you want to delete <strong>{deleteTarget?.firstname} {deleteTarget?.lastname}</strong>?</p>
      </Modal>
    </div>
  )
}
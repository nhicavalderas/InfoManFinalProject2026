import { useState } from 'react'
import Table from '../components/common/Table'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const MOCK_EMPLOYEES = [
  { empno: 'EMP001', lastname: 'Dela Cruz', firstname: 'Juan', middlename: 'Santos', address: 'Manila', birthdate: '1990-01-15', hiredate: '2020-03-01', gender: 'M', status: 'REGULAR', deptCode: 'IT', jobCode: 'DEV01' },
  { empno: 'EMP002', lastname: 'Reyes', firstname: 'Maria', middlename: 'Lopez', address: 'Quezon City', birthdate: '1992-06-20', hiredate: '2021-07-15', gender: 'F', status: 'PROBATIONARY', deptCode: 'HR', jobCode: 'HR01' },
]

const EMPTY_FORM = { empno: '', lastname: '', firstname: '', middlename: '', address: '', birthdate: '', hiredate: '', gender: 'M', status: 'REGULAR', deptCode: '', jobCode: '' }

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = employees.filter(e =>
    e.lastname.toLowerCase().includes(search.toLowerCase()) ||
    e.firstname.toLowerCase().includes(search.toLowerCase()) ||
    e.empno.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => { setEditTarget(null); setForm(EMPTY_FORM); setShowModal(true) }
  const handleEdit = (row) => { setEditTarget(row); setForm({ ...row }); setShowModal(true) }
  const handleDelete = (row) => { setDeleteTarget(row); setShowConfirm(true) }

  const handleSave = () => {
    if (editTarget) {
      setEmployees(prev => prev.map(e => e.empno === editTarget.empno ? form : e))
    } else {
      setEmployees(prev => [...prev, form])
    }
    setShowModal(false)
  }

  const handleConfirmDelete = () => {
    setEmployees(prev => prev.filter(e => e.empno !== deleteTarget.empno))
    setShowConfirm(false)
  }

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))
  })

  const columns = [
    { key: 'empno', label: 'Emp No.' },
    { key: 'lastname', label: 'Last Name' },
    { key: 'firstname', label: 'First Name' },
    { key: 'deptCode', label: 'Department' },
    { key: 'jobCode', label: 'Job Code' },
    {
      key: 'status', label: 'Status',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.status === 'REGULAR' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(row)} className="p-1 text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500">Manage employee records</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Employee
        </Button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or employee number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <Table columns={columns} data={filtered} emptyMessage="No employees found" keyExtractor={r => r.empno} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editTarget ? 'Edit Employee' : 'Add Employee'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Input label="Employee No." id="empno" {...field('empno')} required />
          <Input label="Last Name" id="lastname" {...field('lastname')} required />
          <Input label="First Name" id="firstname" {...field('firstname')} required />
          <Input label="Middle Name" id="middlename" {...field('middlename')} />
          <Input label="Birth Date" id="birthdate" type="date" {...field('birthdate')} />
          <Input label="Hire Date" id="hiredate" type="date" {...field('hiredate')} />
          <div className="col-span-2">
            <Input label="Address" id="address" {...field('address')} />
          </div>
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
          <Input label="Dept Code" id="deptCode" {...field('deptCode')} />
          <Input label="Job Code" id="jobCode" {...field('jobCode')} />
        </div>
      </Modal>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Delete"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to delete <strong>{deleteTarget?.firstname} {deleteTarget?.lastname}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
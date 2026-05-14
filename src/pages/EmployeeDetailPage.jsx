import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Table from '../components/common/Table'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react'

const MOCK_EMPLOYEES = [
  { empno: 'EMP001', lastname: 'Dela Cruz', firstname: 'Juan', middlename: 'Santos', gender: 'M', hiredate: '2020-03-01', status: 'REGULAR', deptCode: 'IT', jobCode: 'DEV02', salary: 40000 },
  { empno: 'EMP002', lastname: 'Reyes', firstname: 'Maria', middlename: 'Lopez', gender: 'F', hiredate: '2021-07-15', status: 'PROBATIONARY', deptCode: 'HR', jobCode: 'HR01', salary: 22000 },
]

const MOCK_JOB_HISTORY = [
  { empno: 'EMP001', jobCode: 'DEV01', jobDesc: 'Junior Developer', deptCode: 'IT', deptName: 'Information Technology', effDate: '2020-03-01', salary: 25000 },
  { empno: 'EMP001', jobCode: 'DEV02', jobDesc: 'Senior Developer', deptCode: 'IT', deptName: 'Information Technology', effDate: '2022-06-01', salary: 40000 },
  { empno: 'EMP002', jobCode: 'HR01', jobDesc: 'HR Officer', deptCode: 'HR', deptName: 'Human Resources', effDate: '2021-07-15', salary: 22000 },
]

const EMPTY_JH = { jobCode: '', jobDesc: '', deptCode: '', deptName: '', effDate: '', salary: '' }

export default function EmployeeDetailPage() {
  const { empno } = useParams()
  const navigate = useNavigate()

  const employee = MOCK_EMPLOYEES.find(e => e.empno === empno)
  const [jobHistory, setJobHistory] = useState(
    MOCK_JOB_HISTORY.filter(j => j.empno === empno)
      .sort((a, b) => new Date(b.effDate) - new Date(a.effDate))
  )

  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_JH)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  if (!employee) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Employee not found.</p>
        <Button onClick={() => navigate('/employees')}>
          <ArrowLeft className="h-4 w-4" /> Back to Employees
        </Button>
      </div>
    )
  }

  const handleAdd = () => { setEditTarget(null); setForm(EMPTY_JH); setShowModal(true) }
  const handleEdit = (row) => { setEditTarget(row); setForm({ ...row }); setShowModal(true) }
  const handleDelete = (row) => { setDeleteTarget(row); setShowConfirm(true) }

  const handleSave = () => {
    if (editTarget) {
      setJobHistory(prev => prev.map(j =>
        j.jobCode === editTarget.jobCode && j.effDate === editTarget.effDate
          ? { ...form, empno }
          : j
      ))
    } else {
      setJobHistory(prev => [...prev, { ...form, empno }]
        .sort((a, b) => new Date(b.effDate) - new Date(a.effDate)))
    }
    setShowModal(false)
  }

  const handleConfirmDelete = () => {
    setJobHistory(prev => prev.filter(j =>
      !(j.jobCode === deleteTarget.jobCode && j.effDate === deleteTarget.effDate)
    ))
    setShowConfirm(false)
  }

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))
  })

  const columns = [
    { key: 'effDate', label: 'Effective Date' },
    { key: 'jobCode', label: 'Job Code' },
    { key: 'jobDesc', label: 'Job Description' },
    { key: 'deptCode', label: 'Dept Code' },
    { key: 'deptName', label: 'Department' },
    {
      key: 'salary', label: 'Salary',
      render: (row) => `₱${Number(row.salary).toLocaleString()}`
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {/* TODO: M4 — gate by JH_EDIT */}
          <button onClick={() => handleEdit(row)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <Pencil className="h-4 w-4" />
          </button>
          {/* TODO: M4 — gate by JH_DEL */}
          <button onClick={() => handleDelete(row)} className="p-1 text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate('/employees')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Employees
      </button>

      {/* Employee Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">
                {employee.firstname[0]}{employee.lastname[0]}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {employee.firstname} {employee.middlename} {employee.lastname}
              </h1>
              <p className="text-gray-500">{employee.empno}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            employee.status === 'REGULAR'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {employee.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Gender</p>
            <p className="text-gray-900 font-medium">{employee.gender === 'M' ? 'Male' : 'Female'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Hire Date</p>
            <p className="text-gray-900 font-medium">{employee.hiredate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Department</p>
            <p className="text-gray-900 font-medium">{employee.deptCode}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Current Salary</p>
            <p className="text-gray-900 font-medium">₱{Number(employee.salary).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Job History Panel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Job History</h2>
            <p className="text-gray-500 text-sm">All job assignments sorted by most recent</p>
          </div>
          {/* TODO: M4 — gate by JH_ADD */}
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Record
          </Button>
        </div>

        <Table
          columns={columns}
          data={jobHistory}
          emptyMessage="No job history found for this employee"
          keyExtractor={(row, i) => i}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editTarget ? 'Edit Job History' : 'Add Job History'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Input label="Job Code" id="jobCode" {...field('jobCode')} required />
          <Input label="Job Description" id="jobDesc" {...field('jobDesc')} required />
          <Input label="Dept Code" id="deptCode" {...field('deptCode')} required />
          <Input label="Department Name" id="deptName" {...field('deptName')} required />
          <Input label="Effective Date" id="effDate" type="date" {...field('effDate')} required />
          <Input label="Salary" id="salary" type="number" {...field('salary')} />
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
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
          Delete job history record <strong>{deleteTarget?.jobCode}</strong> effective <strong>{deleteTarget?.effDate}</strong>?
        </p>
      </Modal>
    </div>
  )
}
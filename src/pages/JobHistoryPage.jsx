import { useState, useEffect } from 'react'
import Table from '../components/common/Table'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { jobHistoryApi } from '../services/api'

const EMPTY_FORM = { empno: '', jobCode: '', deptCode: '', effDate: '', salary: '' }

export default function JobHistoryPage() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterEmpno, setFilterEmpno] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => { loadHistory() }, [])

  const loadHistory = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await jobHistoryApi.getByEmployee(filterEmpno || null)
      setHistory(data || [])
    } catch (err) {
      setError('Failed to load job history: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = filterEmpno
    ? history.filter(h => h.empno?.toLowerCase().includes(filterEmpno.toLowerCase()))
    : history

  const handleAdd = () => { setEditTarget(null); setForm(EMPTY_FORM); setShowModal(true) }
  const handleEdit = (row) => { setEditTarget(row); setForm({ ...row }); setShowModal(true) }
  const handleDelete = (row) => { setDeleteTarget(row); setShowConfirm(true) }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      if (editTarget) {
        await jobHistoryApi.update(form)
      } else {
        await jobHistoryApi.add(form)
      }
      await loadHistory()
      setShowModal(false)
    } catch (err) {
      alert('Error saving: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await jobHistoryApi.softDelete(deleteTarget.empno, deleteTarget.jobCode, deleteTarget.effDate)
      await loadHistory()
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
    { key: 'empno', label: 'Emp No.' },
    { key: 'jobCode', label: 'Job Code' },
    { key: 'deptCode', label: 'Dept Code' },
    { key: 'effDate', label: 'Effective Date' },
    { key: 'salary', label: 'Salary', render: (row) => row.salary ? `₱${Number(row.salary).toLocaleString()}` : '-' },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {/* TODO: M4 — gate by JH_EDIT */}
          <button onClick={(e) => { e.stopPropagation(); handleEdit(row) }} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <Pencil className="h-4 w-4" />
          </button>
          {/* TODO: M4 — gate by JH_DEL */}
          <button onClick={(e) => { e.stopPropagation(); handleDelete(row) }} className="p-1 text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ]

  if (isLoading) return <div className="py-12"><LoadingSpinner text="Loading job history..." /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job History</h1>
          <p className="text-gray-500">Track employee job assignments</p>
        </div>
        {/* TODO: M4 — gate by JH_ADD */}
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Record
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error} <button onClick={loadHistory} className="underline ml-2">Retry</button>
        </div>
      )}

      <div className="mb-4">
        <input type="text" placeholder="Filter by Employee No..."
          value={filterEmpno} onChange={e => setFilterEmpno(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
      </div>

      <Table columns={columns} data={filtered} emptyMessage="No job history found" keyExtractor={(r, i) => i} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editTarget ? 'Edit Job History' : 'Add Job History'}
        footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={handleSave} isLoading={isSaving}>Save</Button></>}>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Employee No." id="empno" {...field('empno')} required />
          <Input label="Job Code" id="jobCode" {...field('jobCode')} required />
          <Input label="Dept Code" id="deptCode" {...field('deptCode')} required />
          <Input label="Effective Date" id="effDate" type="date" {...field('effDate')} required />
          <div className="col-span-2">
            <Input label="Salary" id="salary" type="number" {...field('salary')} />
          </div>
        </div>
      </Modal>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Delete" size="sm"
        footer={<><Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button><Button variant="danger" onClick={handleConfirmDelete}>Delete</Button></>}>
        <p className="text-gray-600">Delete job history for <strong>{deleteTarget?.empno}</strong> effective <strong>{deleteTarget?.effDate}</strong>?</p>
      </Modal>
    </div>
  )
}
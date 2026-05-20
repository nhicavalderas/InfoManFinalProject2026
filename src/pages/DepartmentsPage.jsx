import { useState, useEffect } from 'react'
import Table from '../components/common/Table'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { deptApi } from '../services/api'
import { useRights } from '../hooks/useRights'

const EMPTY_FORM = { deptCode: '', deptName: '' }

export default function DepartmentsPage() {
  const { hasRight, isAdmin } = useRights()
  const [depts, setDepts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => { loadDepts() }, [])

  const loadDepts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await deptApi.getAll()
      setDepts(data || [])
    } catch (err) {
      setError('Failed to load departments: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = () => { setEditTarget(null); setForm(EMPTY_FORM); setShowModal(true) }
  const handleEdit = (row) => { setEditTarget(row); setForm({ ...row }); setShowModal(true) }
  const handleDelete = (row) => { setDeleteTarget(row); setShowConfirm(true) }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      if (editTarget) { await deptApi.update(editTarget.deptCode, form) }
      else { await deptApi.add(form) }
      await loadDepts()
      setShowModal(false)
    } catch (err) {
      alert('Error saving: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await deptApi.softDelete(deleteTarget.deptCode)
      await loadDepts()
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
    { key: 'deptCode', label: 'Dept Code' },
    { key: 'deptname', label: 'Department Name' },
    ...(isAdmin ? [{
      key: 'stamp', label: 'Last Modified By',
      render: (row) => <span className="text-xs text-gray-400">{row.stamp || '—'}</span>
    }] : []),
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {hasRight('DEPT_EDIT') && (
            <button onClick={(e) => { e.stopPropagation(); handleEdit(row) }} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {hasRight('DEPT_DEL') && (
            <button onClick={(e) => { e.stopPropagation(); handleDelete(row) }} className="p-1 text-red-600 hover:bg-red-50 rounded">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    }
  ]

  if (isLoading) return <div className="py-12"><LoadingSpinner text="Loading departments..." /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-500">Manage department codes</p>
        </div>
        {hasRight('DEPT_ADD') && (
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Department
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error} <button onClick={loadDepts} className="underline ml-2">Retry</button>
        </div>
      )}

      <Table columns={columns} data={depts} emptyMessage="No departments found" keyExtractor={r => r.deptCode} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editTarget ? 'Edit Department' : 'Add Department'} size="sm"
        footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={handleSave} isLoading={isSaving}>Save</Button></>}>
        <div className="space-y-4">
          <Input label="Dept Code" id="deptCode" {...field('deptCode')} required />
          <Input label="Department Name" id="deptName" {...field('deptName')} required />
        </div>
      </Modal>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Delete" size="sm"
        footer={<><Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button><Button variant="danger" onClick={handleConfirmDelete}>Delete</Button></>}>
        <p className="text-gray-600">Delete department <strong>{deleteTarget?.deptCode} - {deleteTarget?.deptName}</strong>?</p>
      </Modal>
    </div>
  )
}
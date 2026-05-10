import { useState } from 'react'
import Table from '../components/common/Table'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import { Plus, Pencil, Trash2 } from 'lucide-react'
 
const MOCK_DEPTS = [
  { deptCode: 'IT', deptName: 'Information Technology' },
  { deptCode: 'HR', deptName: 'Human Resources' },
  { deptCode: 'FIN', deptName: 'Finance' },
]
 
export default function DepartmentsPage() {
  const [depts, setDepts] = useState(MOCK_DEPTS)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState({ deptCode: '', deptName: '' })
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
 
  const handleAdd = () => { setEditTarget(null); setForm({ deptCode: '', deptName: '' }); setShowModal(true) }
  const handleEdit = (row) => { setEditTarget(row); setForm({ ...row }); setShowModal(true) }
  const handleDelete = (row) => { setDeleteTarget(row); setShowConfirm(true) }
 
  const handleSave = () => {
    if (editTarget) setDepts(prev => prev.map(d => d.deptCode === editTarget.deptCode ? form : d))
    else setDepts(prev => [...prev, form])
    setShowModal(false)
  }
 
  const cols = [
    { key: 'deptCode', label: 'Dept Code' },
    { key: 'deptName', label: 'Department Name' },
    { key: 'actions', label: 'Actions', render: (row) => (
      <div className="flex gap-2">
        <button onClick={() => handleEdit(row)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="h-4 w-4" /></button>
        <button onClick={() => handleDelete(row)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
      </div>
    )}
  ]
 
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Departments</h1><p className="text-gray-500">Manage department codes</p></div>
        <Button onClick={handleAdd}><Plus className="h-4 w-4" /> Add Department</Button>
      </div>
      <Table columns={cols} data={depts} emptyMessage="No departments found" keyExtractor={r => r.deptCode} />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Edit Department' : 'Add Department'} size="sm"
        footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></>}>
        <div className="space-y-4">
          <Input label="Dept Code" id="deptCode" value={form.deptCode} onChange={e => setForm(p => ({...p, deptCode: e.target.value}))} required />
          <Input label="Department Name" id="deptName" value={form.deptName} onChange={e => setForm(p => ({...p, deptName: e.target.value}))} required />
        </div>
      </Modal>
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Delete" size="sm"
        footer={<><Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button><Button variant="danger" onClick={() => { setDepts(p => p.filter(d => d.deptCode !== deleteTarget?.deptCode)); setShowConfirm(false) }}>Delete</Button></>}>
        <p className="text-gray-600">Delete department <strong>{deleteTarget?.deptCode} - {deleteTarget?.deptName}</strong>?</p>
      </Modal>
    </div>
  )
}
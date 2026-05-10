import { useState } from 'react'
import Table from '../components/common/Table'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import { Plus, Pencil, Trash2 } from 'lucide-react'
 
const MOCK_JOBS = [
  { jobCode: 'DEV01', jobTitle: 'Junior Developer', jobDesc: 'Entry level software developer' },
  { jobCode: 'DEV02', jobTitle: 'Senior Developer', jobDesc: 'Senior software developer' },
  { jobCode: 'HR01', jobTitle: 'HR Officer', jobDesc: 'Human resources officer' },
]
 
export default function JobsPage() {
  const [jobs, setJobs] = useState(MOCK_JOBS)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState({ jobCode: '', jobTitle: '', jobDesc: '' })
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
 
  const handleAdd = () => { setEditTarget(null); setForm({ jobCode: '', jobTitle: '', jobDesc: '' }); setShowModal(true) }
  const handleEdit = (row) => { setEditTarget(row); setForm({ ...row }); setShowModal(true) }
  const handleDelete = (row) => { setDeleteTarget(row); setShowConfirm(true) }
 
  const handleSave = () => {
    if (editTarget) setJobs(prev => prev.map(j => j.jobCode === editTarget.jobCode ? form : j))
    else setJobs(prev => [...prev, form])
    setShowModal(false)
  }
 
  const cols = [
    { key: 'jobCode', label: 'Job Code' },
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'jobDesc', label: 'Description' },
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
        <div><h1 className="text-2xl font-bold text-gray-900">Jobs</h1><p className="text-gray-500">Manage job codes and titles</p></div>
        <Button onClick={handleAdd}><Plus className="h-4 w-4" /> Add Job</Button>
      </div>
      <Table columns={cols} data={jobs} emptyMessage="No jobs found" keyExtractor={r => r.jobCode} />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Edit Job' : 'Add Job'} size="sm"
        footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></>}>
        <div className="space-y-4">
          <Input label="Job Code" id="jobCode" value={form.jobCode} onChange={e => setForm(p => ({...p, jobCode: e.target.value}))} required />
          <Input label="Job Title" id="jobTitle" value={form.jobTitle} onChange={e => setForm(p => ({...p, jobTitle: e.target.value}))} required />
          <Input label="Description" id="jobDesc" value={form.jobDesc} onChange={e => setForm(p => ({...p, jobDesc: e.target.value}))} />
        </div>
      </Modal>
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Delete" size="sm"
        footer={<><Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button><Button variant="danger" onClick={() => { setJobs(p => p.filter(j => j.jobCode !== deleteTarget?.jobCode)); setShowConfirm(false) }}>Delete</Button></>}>
        <p className="text-gray-600">Delete job <strong>{deleteTarget?.jobCode} - {deleteTarget?.jobTitle}</strong>?</p>
      </Modal>
    </div>
  )
}
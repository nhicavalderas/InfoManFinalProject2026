import { useState } from 'react'
import Table from '../components/common/Table'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import { Plus, Pencil, Trash2 } from 'lucide-react'
 
const MOCK_HISTORY = [
  { empno: 'EMP001', jobCode: 'DEV01', deptCode: 'IT', effDate: '2020-03-01', salary: 25000 },
  { empno: 'EMP001', jobCode: 'DEV02', deptCode: 'IT', effDate: '2022-06-01', salary: 40000 },
  { empno: 'EMP002', jobCode: 'HR01', deptCode: 'HR', effDate: '2021-07-15', salary: 22000 },
]
 
export default function JobHistoryPage() {
  const [history, setHistory] = useState(MOCK_HISTORY)
  const [filterEmpno, setFilterEmpno] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState({ empno: '', jobCode: '', deptCode: '', effDate: '', salary: '' })
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
 
  const filtered = filterEmpno ? history.filter(h => h.empno.toLowerCase().includes(filterEmpno.toLowerCase())) : history
 
  const handleAdd = () => { setEditTarget(null); setForm({ empno: '', jobCode: '', deptCode: '', effDate: '', salary: '' }); setShowModal(true) }
  const handleEdit = (row) => { setEditTarget(row); setForm({ ...row }); setShowModal(true) }
  const handleDelete = (row) => { setDeleteTarget(row); setShowConfirm(true) }
 
  const handleSave = () => {
    if (editTarget) setHistory(prev => prev.map(h => h.empno === editTarget.empno && h.effDate === editTarget.effDate ? form : h))
    else setHistory(prev => [...prev, form])
    setShowModal(false)
  }
 
  const cols = [
    { key: 'empno', label: 'Emp No.' },
    { key: 'jobCode', label: 'Job Code' },
    { key: 'deptCode', label: 'Dept Code' },
    { key: 'effDate', label: 'Effective Date' },
    { key: 'salary', label: 'Salary', render: (row) => `₱${Number(row.salary).toLocaleString()}` },
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
        <div><h1 className="text-2xl font-bold text-gray-900">Job History</h1><p className="text-gray-500">Track employee job assignments</p></div>
        <Button onClick={handleAdd}><Plus className="h-4 w-4" /> Add Record</Button>
      </div>
      <div className="mb-4">
        <input type="text" placeholder="Filter by Employee No..." value={filterEmpno}
          onChange={e => setFilterEmpno(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
      </div>
      <Table columns={cols} data={filtered} emptyMessage="No job history found" keyExtractor={(r, i) => i} />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Edit Job History' : 'Add Job History'}
        footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></>}>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Employee No." id="empno" value={form.empno} onChange={e => setForm(p => ({...p, empno: e.target.value}))} required />
          <Input label="Job Code" id="jobCode" value={form.jobCode} onChange={e => setForm(p => ({...p, jobCode: e.target.value}))} required />
          <Input label="Dept Code" id="deptCode" value={form.deptCode} onChange={e => setForm(p => ({...p, deptCode: e.target.value}))} required />
          <Input label="Effective Date" id="effDate" type="date" value={form.effDate} onChange={e => setForm(p => ({...p, effDate: e.target.value}))} required />
          <div className="col-span-2"><Input label="Salary" id="salary" type="number" value={form.salary} onChange={e => setForm(p => ({...p, salary: e.target.value}))} /></div>
        </div>
      </Modal>
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Delete" size="sm"
        footer={<><Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button><Button variant="danger" onClick={() => { setHistory(p => p.filter((h,i) => !(h.empno === deleteTarget.empno && h.effDate === deleteTarget.effDate))); setShowConfirm(false) }}>Delete</Button></>}>
        <p className="text-gray-600">Delete job history record for <strong>{deleteTarget?.empno}</strong> effective <strong>{deleteTarget?.effDate}</strong>?</p>
      </Modal>
    </div>
  )
}
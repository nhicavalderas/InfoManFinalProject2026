import { useState, useEffect } from 'react'
import Table from '../components/common/Table'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import { RotateCcw } from 'lucide-react'
import { employeeApi, jobApi, deptApi, jobHistoryApi } from '../services/api'

const TABS = ['All', 'Employee', 'Department', 'Job', 'Job History']

export default function DeletedItemsPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { loadDeletedItems() }, [])

  const loadDeletedItems = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [emps, jobs, depts, jh] = await Promise.all([
        employeeApi.getAll('ADMIN').catch(() => []),
        jobApi.getAll('ADMIN').catch(() => []),
        deptApi.getAll('ADMIN').catch(() => []),
        jobHistoryApi.getByEmployee(null, 'ADMIN').catch(() => []),
      ])
      const deleted = [
        ...(emps || []).filter(e => e.record_status === 'INACTIVE').map(e => ({
          type: 'Employee', code: e.empno, name: `${e.firstname} ${e.lastname}`,
          stamp: e.stamp || '-', raw: e
        })),
        ...(jobs || []).filter(j => j.record_status === 'INACTIVE').map(j => ({
          type: 'Job', code: j.jobCode, name: j.jobTitle || j.jobDesc,
          stamp: j.stamp || '-', raw: j
        })),
        ...(depts || []).filter(d => d.record_status === 'INACTIVE').map(d => ({
          type: 'Department', code: d.deptCode, name: d.deptName,
          stamp: d.stamp || '-', raw: d
        })),
        ...(jh || []).filter(h => h.record_status === 'INACTIVE').map(h => ({
          type: 'Job History', code: h.empno, name: `${h.empno} — ${h.jobCode} (${h.effDate})`,
          stamp: h.stamp || '-', raw: h
        })),
      ]
      setItems(deleted)
    } catch (err) {
      setError('Failed to load deleted items: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecover = async (item) => {
    try {
      if (item.type === 'Employee') await employeeApi.recover(item.code)
      else if (item.type === 'Job') await jobApi.recover(item.code)
      else if (item.type === 'Department') await deptApi.recover(item.code)
      else if (item.type === 'Job History') await jobHistoryApi.recover(item.raw.empno, item.raw.jobCode, item.raw.effDate)
      await loadDeletedItems()
    } catch (err) {
      alert('Error recovering: ' + err.message)
    }
  }

  const filtered = activeTab === 'All' ? items : items.filter(i => i.type === activeTab)

  const columns = [
    { key: 'type', label: 'Type', render: (row) => <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">{row.type}</span> },
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'stamp', label: 'Deleted By' },
    { key: 'actions', label: 'Actions', render: (row) => (
      <button onClick={() => handleRecover(row)} className="flex items-center gap-1 px-3 py-1 text-sm text-green-700 bg-green-50 hover:bg-green-100 rounded-lg">
        <RotateCcw className="h-3 w-3" /> Recover
      </button>
    )}
  ]

  if (isLoading) return <div className="py-12"><LoadingSpinner text="Loading deleted items..." /></div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Deleted Items</h1>
        <p className="text-gray-500">View and recover soft-deleted records</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error} <button onClick={loadDeletedItems} className="underline ml-2">Retry</button>
        </div>
      )}

      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <EmptyState title="No deleted items" description="There are no deleted records to display." />
        : <Table columns={columns} data={filtered} emptyMessage="No deleted items" keyExtractor={(r, i) => i} />
      }
    </div>
  )
}
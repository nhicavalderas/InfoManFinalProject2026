import { useState } from 'react'
import Table from '../components/common/Table'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import { RotateCcw } from 'lucide-react'
 
const MOCK_DELETED = [
  { type: 'Employee', code: 'EMP099', name: 'Pedro Santos', deletedBy: 'admin', deletedAt: '2024-12-01' },
  { type: 'Department', code: 'MKT', name: 'Marketing', deletedBy: 'admin', deletedAt: '2025-01-10' },
]
 
export default function DeletedItemsPage() {
  const [items, setItems] = useState(MOCK_DELETED)
  const [activeTab, setActiveTab] = useState('All')
  const tabs = ['All', 'Employee', 'Department', 'Job', 'Job History']
 
  const filtered = activeTab === 'All' ? items : items.filter(i => i.type === activeTab)
 
  const handleRecover = (item) => {
    // TODO: M1 — call recover API then remove from list
    setItems(prev => prev.filter(i => !(i.type === item.type && i.code === item.code)))
    alert(`Recovered: ${item.name}`)
  }
 
  const cols = [
    { key: 'type', label: 'Type', render: (row) => <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">{row.type}</span> },
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'deletedBy', label: 'Deleted By' },
    { key: 'deletedAt', label: 'Deleted At' },
    { key: 'actions', label: 'Actions', render: (row) => (
      <button onClick={() => handleRecover(row)} className="flex items-center gap-1 px-3 py-1 text-sm text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
        <RotateCcw className="h-3 w-3" /> Recover
      </button>
    )}
  ]
 
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Deleted Items</h1>
        <p className="text-gray-500">View and recover soft-deleted records</p>
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {tab}
          </button>
        ))}
      </div>
      {filtered.length === 0
        ? <EmptyState title="No deleted items" description="There are no deleted records to display." />
        : <Table columns={cols} data={filtered} emptyMessage="No deleted items" keyExtractor={(r, i) => i} />
      }
    </div>
  )
}
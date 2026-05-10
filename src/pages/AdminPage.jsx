import EmptyState from '../components/common/EmptyState'

export default function AdminPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <p className="text-gray-500">User management and system settings</p>
      </div>
      <EmptyState 
        title="Admin Module" 
        description="User activation and rights management. Coming in Sprint 3."
      />
    </div>
  )
}
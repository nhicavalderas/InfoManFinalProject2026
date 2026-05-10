import LoadingSpinner from './LoadingSpinner'
import EmptyState from './EmptyState'

export default function Table({ 
  columns, 
  data, 
  isLoading = false, 
  emptyMessage = 'No records found',
  onRowClick = null,
  keyExtractor = (item, index) => index
}) {
  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner text="Loading data..." />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyMessage} />
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr 
              key={keyExtractor(item, index)}
              onClick={() => onRowClick?.(item)}
              className={`bg-white hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 whitespace-nowrap text-gray-900">
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
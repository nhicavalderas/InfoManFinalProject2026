import { FileX } from 'lucide-react'

export default function EmptyState({ 
  title = 'No records found', 
  description = 'There are no items to display at this time.',
  action = null 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <FileX className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-4">{description}</p>
      {action}
    </div>
  )
}
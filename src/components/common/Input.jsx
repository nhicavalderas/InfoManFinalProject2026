export default function Input({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  id,
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2.5 border rounded-lg transition-colors duration-200
          ${error 
            ? 'border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500' 
            : 'border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500'
          }
          outline-none`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
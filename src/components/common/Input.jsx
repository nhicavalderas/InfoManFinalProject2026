export default function Input({
  label, type = 'text', placeholder, value, onChange,
  error, required = false, id, ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-2">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange}
        className={`w-full px-4 py-3 bg-white border-2 rounded-xl transition-all duration-200 outline-none placeholder:text-slate-400 text-slate-900
          ${error
            ? 'border-red-400 focus:ring-4 focus:ring-red-100 focus:border-red-500'
            : 'border-slate-200 focus:ring-4 focus:ring-hope-100 focus:border-hope-500 hover:border-slate-300'
          }`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
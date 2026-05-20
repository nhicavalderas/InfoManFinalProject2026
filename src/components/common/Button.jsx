export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const base = "px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
  const variants = {
    primary: "bg-gradient-to-r from-hope-600 to-hope-500 text-white hover:from-hope-700 hover:to-hope-600 disabled:from-hope-300 disabled:to-hope-300 shadow-md shadow-hope-500/20 hover:shadow-lg",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:bg-slate-50 shadow-sm",
    danger: "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 disabled:opacity-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${className}`} {...props}>
      {isLoading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      )}
      {children}
    </button>
  )
}
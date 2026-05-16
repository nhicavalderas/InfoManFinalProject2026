import { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'
import GoogleAuthButton from './GoogleAuthButton'

export default function LoginForm({ onEmailSubmit, onGoogleClick, isLoading = false, error = null }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format'
    if (!password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) onEmailSubmit({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3 animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <Input id="email" label="Email Address" type="email" placeholder="you@company.com"
        value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required />

      <div className="space-y-1">
        <Input id="password" label="Password" type="password" placeholder="••••••••"
          value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} required />
        <div className="flex justify-end">
          <button type="button" className="text-xs text-hope-600 hover:text-hope-700 font-medium transition-colors">
            Forgot password?
          </button>
        </div>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full py-3 text-base">
        Sign In
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white/80 text-slate-400 font-medium">Or continue with</span>
        </div>
      </div>

      <GoogleAuthButton onClick={onGoogleClick} isLoading={isLoading} />
    </form>
  )
}
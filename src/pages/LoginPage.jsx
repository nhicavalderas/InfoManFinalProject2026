import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import LoginForm from '../components/auth/LoginForm'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login, loginWithGoogle } = useAuth()

  const handleEmailSubmit = async ({ email, password }) => {
    setIsLoading(true)
    setError(null)
    const { error } = await login(email, password)
    if (error) setError(error.message)
    setIsLoading(false)
  }

  const handleGoogleClick = () => loginWithGoogle()

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-hope-50 to-slate-100">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-hope-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-hope-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-8 left-1/3 w-80 h-80 bg-hope-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-hope-500 to-hope-700 rounded-2xl shadow-glow mb-6 transform transition-transform hover:scale-105 duration-300">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome back</h1>
          <p className="text-slate-500 text-lg">Sign in to your <span className="font-semibold text-hope-600">Hope HR</span> account</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-glass border border-white/50 p-8">
          <LoginForm
            onEmailSubmit={handleEmailSubmit}
            onGoogleClick={handleGoogleClick}
            isLoading={isLoading}
            error={error}
          />
        </div>

        <p className="text-center mt-8 text-sm text-slate-500">
          Don't have an account?{' '}
          <a href="/register" className="text-hope-600 hover:text-hope-700 font-semibold transition-colors hover:underline underline-offset-2">
            Register here
          </a>
        </p>

        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Secured with enterprise-grade encryption</span>
        </div>
      </div>
    </div>
  )
}
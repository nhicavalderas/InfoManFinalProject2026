import { useEffect } from 'react'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function AuthCallbackPage({ onComplete }) {
  useEffect(() => {
    // TODO: M4 — Handle OAuth callback, exchange code for session
    const timer = setTimeout(() => {
      console.log('OAuth callback processed')
      onComplete()
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <LoadingSpinner size="lg" text="Setting up your session..." />
        <p className="mt-4 text-gray-500 text-sm">
          Please wait while we complete your authentication
        </p>
      </div>
    </div>
  )
}
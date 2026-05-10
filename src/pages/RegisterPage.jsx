import { useState } from 'react'
import RegisterForm from '../components/auth/RegisterForm'

export default function RegisterPage({ onNavigate }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (formData) => {
    setIsLoading(true)
    setError(null)
    
    // TODO: M4 — Replace with actual Supabase auth.signUp()
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Register:', formData)
      // Show success and redirect to login
      alert('Registration successful! Please check your email to confirm.')
      onNavigate('login')
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleClick = () => {
    // TODO: M4 — Wire to Google OAuth registration
    console.log('Google register clicked')
    onNavigate('callback')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-500 mt-1">Join Hope HR as a new user</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <RegisterForm 
            onSubmit={handleSubmit}
            onGoogleClick={handleGoogleClick}
            isLoading={isLoading}
            error={error}
          />
        </div>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={() => onNavigate('login')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  )
}
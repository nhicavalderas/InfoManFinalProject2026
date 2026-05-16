/**
 * RegisterPage.jsx - User Registration Page
 * 
 * PURPOSE:
 * - Allows new users to create an account via email/password
 * - Also supports Google OAuth registration
 * - After successful registration, user must wait for admin activation
 * - Redirects to login page after registration
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import RegisterForm from '../components/auth/RegisterForm'

export default function RegisterPage() {
  // ========== STATE VARIABLES ==========
  const [isLoading, setIsLoading] = useState(false)  // Show loading spinner
  const [error, setError] = useState(null)           // Store error messages
  const navigate = useNavigate()                      // For redirecting between pages
  
  // Get auth functions from AuthContext
  const { signUp, loginWithGoogle } = useAuth()

  /**
   * handleSubmit - Process email/password registration
   * Called when user submits the registration form
   * @param {object} formData - Contains email, password, firstName, lastName, username
   */
  const handleSubmit = async (formData) => {
    // Show loading state and clear previous errors
    setIsLoading(true)
    setError(null)
    
    // Extract form fields
    const { email, password, firstName, lastName, username } = formData
    
    // Call Supabase signUp function
    const { error: signUpError } = await signUp(email, password, {
      first_name: firstName,
      last_name: lastName,
      username: username
    })
    
    // Handle any errors from Supabase
    if (signUpError) {
      setError(signUpError.message)
    } else {
      // Registration successful - user row created by provision_new_user trigger
      alert('Registration successful! Please check your email to confirm.')
      navigate('/login')  // Send user to login page
    }
    
    setIsLoading(false)
  }

  /**
   * handleGoogleClick - Initiate Google OAuth registration
   * Redirects to Google's OAuth consent screen
   */
  const handleGoogleClick = () => {
    loginWithGoogle()
  }

  // ========== RENDER REGISTRATION FORM ==========
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header section with logo and title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            {/* HR icon SVG */}
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-500 mt-1">Join Hope HR as a new user</p>
        </div>

        {/* Registration form component */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <RegisterForm 
            onSubmit={handleSubmit}
            onGoogleClick={handleGoogleClick}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Link to login page for existing users */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  )
}
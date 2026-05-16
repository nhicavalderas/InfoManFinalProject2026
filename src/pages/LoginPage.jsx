/**
 * LoginPage.jsx - User Login Page
 * 
 * PURPOSE:
 * - Allows existing users to log in via email/password
 * - Also supports Google OAuth login
 * - After successful login, redirects to employees page
 * - INACTIVE users are blocked by the login guard in AuthContext
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginForm from '../components/auth/LoginForm'

export default function LoginPage() {
  // ========== STATE VARIABLES ==========
  const [isLoading, setIsLoading] = useState(false)  // Show loading spinner during login
  const [error, setError] = useState(null)           // Store error messages from failed login
  const navigate = useNavigate()                      // For redirecting after successful login
  
  // Get auth functions from AuthContext
  const { login, loginWithGoogle } = useAuth()

  /**
   * handleEmailSubmit - Process email/password login
   * Called when user submits the login form
   * @param {object} param - Contains email and password from the form
   */
  const handleEmailSubmit = async ({ email, password }) => {
    // Show loading state and clear previous errors
    setIsLoading(true)
    setError(null)
    
    // Call Supabase signInWithPassword function
    const { error: loginError } = await login(email, password)
    
    // Handle any errors from Supabase (wrong password, user not found, etc.)
    if (loginError) {
      setError(loginError.message)
    } else {
      // On success, redirect to employees page
      navigate('/employees')
    }
    
    setIsLoading(false)
  }

  /**
   * handleGoogleClick - Initiate Google OAuth login
   * Redirects to Google's OAuth consent screen, then back to /auth/callback
   */
  const handleGoogleClick = () => {
    loginWithGoogle()
  }

  // ========== RENDER LOGIN FORM ==========
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        {/* Header section with logo and welcome message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            {/* HR icon SVG - represents Human Resources */}
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to your Hope HR account</p>
        </div>

        {/* Login form component - handles email/password and Google button */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <LoginForm
            onEmailSubmit={handleEmailSubmit}
            onGoogleClick={handleGoogleClick}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Link to registration page for new users */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}
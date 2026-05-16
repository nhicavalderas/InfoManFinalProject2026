/**
 * AuthCallbackPage.jsx - Handles Google OAuth Redirect Callback
 * 
 * PURPOSE:
 * - Receives OAuth callback from Google after user signs in
 * - Exchanges authorization code for Supabase session
 * - Redirects to /employees on success, /login on failure
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/api'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    console.log('AuthCallbackPage loaded - URL:', window.location.href)
    
    // Exchange the OAuth code for a session
    supabase.auth.exchangeCodeForSession(window.location.href)
      .then((result) => {
        console.log('Exchange successful:', result)
        navigate('/employees')
      })
      .catch((error) => {
        console.error('Exchange failed:', error)
        console.error('Error message:', error.message)
        console.error('Error status:', error.status)
        navigate('/login')
      })
  }, [navigate])

  // Show loading spinner while processing the OAuth callback
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        {/* Loading spinner animation */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}
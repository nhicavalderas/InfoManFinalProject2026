import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/api'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.exchangeCodeForSession(window.location.href).then(() => {
      navigate('/employees')
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <p className="text-gray-600">Setting up your session...</p>
      </div>
    </div>
  )
}
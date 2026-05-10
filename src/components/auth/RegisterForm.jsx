import { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'
import GoogleAuthButton from './GoogleAuthButton'

export default function RegisterForm({ onSubmit, onGoogleClick, isLoading = false, error = null }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear error when user types
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.username.trim()) newErrors.username = 'Username is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="firstName"
          label="First Name"
          placeholder="John"
          value={formData.firstName}
          onChange={handleChange('firstName')}
          error={errors.firstName}
          required
        />
        <Input
          id="lastName"
          label="Last Name"
          placeholder="Doe"
          value={formData.lastName}
          onChange={handleChange('lastName')}
          error={errors.lastName}
          required
        />
      </div>
      
      <Input
        id="username"
        label="Username"
        placeholder="johndoe"
        value={formData.username}
        onChange={handleChange('username')}
        error={errors.username}
        required
      />
      
      <Input
        id="email"
        label="Email Address"
        type="email"
        placeholder="you@company.com"
        value={formData.email}
        onChange={handleChange('email')}
        error={errors.email}
        required
      />
      
      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange('password')}
        error={errors.password}
        required
      />
      
      <Button type="submit" isLoading={isLoading} className="w-full">
        Create Account
      </Button>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or register with</span>
        </div>
      </div>
      
      <GoogleAuthButton onClick={onGoogleClick} isLoading={isLoading} text="Register with Google" />
    </form>
  )
}
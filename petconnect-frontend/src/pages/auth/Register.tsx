import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as auth from '../../lib/authClient'
import AuthLayout from '../../components/layout/AuthLayout'
import { Input, Label } from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'owner' | 'walker'>('owner')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await auth.register({ name, email, phone, password, role })
      const userId = res.data?.user?.id
      if (userId) {
        navigate('/verify', { state: { userId } })
      } else {
        navigate('/login')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Find trusted walkers or start walking">
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            title="Please enter a valid email address"
            className={
              email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                ? 'border-red-500'
                : ''
            }
          />
          {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
            <div className="text-xs text-red-600 mt-1">Please enter a valid email address.</div>
          )}
        </div>
        <div>
          <Label>Phone</Label>
          <Input placeholder="Enter your phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div>
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // Eye-off icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.326 0 2.59.26 3.75.725M19.07 4.93a10.05 10.05 0 012.93 4.07c0 3-4 7-9 7-.326 0-.646-.02-.96-.06M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                </svg>
              ) : (
                // Eye icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div>
          <Label>Confirm Password</Label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              // Show error style if passwords do not match and confirmPassword is not empty
              className={
                confirmPassword && confirmPassword !== password
                  ? 'border-red-500'
                  : ''
              }
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                // Eye-off icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.326 0 2.59.26 3.75.725M19.07 4.93a10.05 10.05 0 012.93 4.07c0 3-4 7-9 7-.326 0-.646-.02-.96-.06M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                </svg>
              ) : (
                // Eye icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {confirmPassword && confirmPassword !== password && (
            <div className="text-xs text-red-600 mt-1">Passwords do not match</div>
          )}
        </div>
        <div>
          <Label>Role</Label>
          <div className="flex gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="role"
                value="owner"
                checked={role === 'owner'}
                onChange={() => setRole('owner')}
                className="accent-brand-leaf mr-2"
              />
              <span>Pet Owner</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="role"
                value="walker"
                checked={role === 'walker'}
                onChange={() => setRole('walker')}
                className="accent-brand-leaf mr-2"
              />
              <span>Walker</span>
            </label>
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full rounded-full">
          {loading ? 'Creating…' : 'Create account'}
        </Button>
      </form>
      <div className="mt-4 text-sm text-center">
        Already have an account? <Link to="/login" className="text-brand-leaf hover:underline">Sign in</Link>
      </div>
    </AuthLayout>
  )
}



import { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import AuthLayout from '../../components/layout/AuthLayout'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)
    try {
      const { data } = await api.post('/auth/reset-password', { token, password })
      setMessage(data?.message || 'Password reset')
      setTimeout(() => navigate('/login'), 1000)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Enter your new password below">
      {message && <div className="mb-3 text-sm text-green-400">{message}</div>}
      {error && <div className="mb-3 text-sm text-red-400">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Updating…' : 'Update password'}</Button>
      </form>
      <div className="mt-4 text-sm text-center">
        <Link to="/login" className="text-white/80 hover:underline">Back to sign in</Link>
      </div>
    </AuthLayout>
  )
}



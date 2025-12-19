import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import AuthLayout from '../../components/layout/AuthLayout'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)
    try {
      const { data } = await api.post('/auth/forgot-password', { email })
      setMessage(data?.message || 'Email sent')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset your password" subtitle="We will send a reset link">
      {message && <div className="mb-3 text-sm text-green-400">{message}</div>}
      {error && <div className="mb-3 text-sm text-red-400">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Sending…' : 'Send reset link'}</Button>
      </form>
      <div className="mt-4 text-sm text-center">
        <Link to="/login" className="text-white/80 hover:underline">Back to sign in</Link>
      </div>
    </AuthLayout>
  )
}



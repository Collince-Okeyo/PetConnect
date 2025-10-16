import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { verifyOtp, resendVerification } from '../../lib/authClient'
import AuthLayout from '../../components/layout/AuthLayout'
import { Input, Label } from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function VerifyOTP() {
  const navigate = useNavigate()
  const location = useLocation() as any
  const initialUserId = location?.state?.userId as string | undefined
  const [userId, setUserId] = useState<string>(initialUserId || '')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await verifyOtp({ userId, otp })
      setMessage('Verified! You can now sign in.')
      setTimeout(() => navigate('/login'), 1000)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  async function onResend() {
    setError(null)
    setMessage(null)
    try {
      await resendVerification({ userId })
      setMessage('OTP resent successfully')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to resend OTP')
    }
  }

  return (
    <AuthLayout title="Verify your phone" subtitle="Enter the 6-digit code">
      {message && <div className="mb-3 text-sm text-green-400">{message}</div>}
      {error && <div className="mb-3 text-sm text-red-400">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label>User ID</Label>
          <Input value={userId} onChange={(e) => setUserId(e.target.value)} required />
        </div>
        <div>
          <Label>OTP</Label>
          <Input className="tracking-widest text-center" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} />
        </div>
        <Button disabled={loading} className="w-full">{loading ? 'Verifying…' : 'Verify'}</Button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        <button onClick={onResend} className="text-white/80 hover:underline">Resend code</button>
        <Link to="/login" className="text-white/80 hover:underline">Back to sign in</Link>
      </div>
    </AuthLayout>
  )
}



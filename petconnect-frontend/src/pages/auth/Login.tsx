import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { googleLogin, facebookLogin } from '../../lib/authClient'
import AuthLayout from '../../components/layout/AuthLayout'
import { Input, Label } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import SocialButtons from '../../components/auth/SocialButtons'

export default function Login() {
  const { login, setAuth } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ email, password })
      console.log('Login successful'+ email + ' ' + password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  async function onGoogle() {
    setError(null)
    setLoading(true)
    try {
      // TODO: Replace with real Google client flow to obtain accessToken
      const googleAccessToken = 'REPLACE_WITH_GOOGLE_ACCESS_TOKEN'
      const res = await googleLogin(googleAccessToken)
      const user = res.data?.user ?? null
      const tokens = res.data?.tokens ?? null
      if (user && tokens) {
        setAuth(user, tokens)
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Google login failed')
    } finally {
      setLoading(false)
    }
  }

  async function onFacebook() {
    setError(null)
    setLoading(true)
    try {
      const fbAccessToken = 'REPLACE_WITH_FACEBOOK_ACCESS_TOKEN'
      const res = await facebookLogin(fbAccessToken)
      const user = res.data?.user ?? null
      const tokens = res.data?.tokens ?? null
      if (user && tokens) {
        setAuth(user, tokens)
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Facebook login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue walking tails">
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
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
        <Button type="submit" disabled={loading} className="w-full rounded-full">
          {loading ? 'Sign in…' : 'Sign in'}
        </Button>
      </form>
      <SocialButtons onGoogle={onGoogle} onFacebook={onFacebook} loading={loading} />
      <div className="mt-4 flex justify-between text-sm">
        <Link to="/forgot" className="text-brand-leaf hover:underline">Forgot password?</Link>
        <Link to="/register" className="text-brand-leaf hover:underline">Create account</Link>
      </div>
    </AuthLayout>
  )
}



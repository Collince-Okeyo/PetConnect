import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Dog, Mail, Phone, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { verifyPhoneOTP, verifyEmailOTP, resendPhoneOTP, resendEmailOTP } from '../../lib/authClient'


export default function VerifyOTP() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [step, setStep] = useState<'phone' | 'email' | 'complete'>('phone')
  const [phoneOTP, setPhoneOTP] = useState(['', '', '', '', '', ''])
  const [emailOTP, setEmailOTP] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(60)

  // Redirect if no user (not registered/logged in)
  useEffect(() => {
    if (!user) {
      navigate('/register')
    }
  }, [user, navigate])

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleOTPChange = (index: number, value: string, isPhone: boolean) => {
    if (value.length > 1) return // Only allow single digit

    const newOTP = isPhone ? [...phoneOTP] : [...emailOTP]
    newOTP[index] = value

    if (isPhone) {
      setPhoneOTP(newOTP)
    } else {
      setEmailOTP(newOTP)
    }

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${isPhone ? 'phone' : 'email'}-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent, isPhone: boolean) => {
    if (e.key === 'Backspace' && !((isPhone ? phoneOTP : emailOTP)[index]) && index > 0) {
      const prevInput = document.getElementById(`otp-${isPhone ? 'phone' : 'email'}-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const otp = phoneOTP.join('')
    if (otp.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    if (!user?.id) {
      setError('User session not found. Please register again.')
      return
    }

    setLoading(true)
    try {
      await verifyPhoneOTP({ userId: user.id, otp })
      setStep('email')
      setResendTimer(60) // Reset timer for email OTP
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }



  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const otp = emailOTP.join('')
    if (otp.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    if (!user?.id) {
      setError('User session not found. Please register again.')
      return
    }

    setLoading(true)
    try {
      await verifyEmailOTP({ userId: user.id, otp })
      setStep('complete')
      // Redirect to login so user can login and complete document verification
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async (type: 'phone' | 'email') => {
    setError(null)

    if (!user?.id) {
      setError('User session not found. Please register again.')
      return
    }

    try {
      if (type === 'phone') {
        await resendPhoneOTP({ userId: user.id })
      } else {
        await resendEmailOTP({ userId: user.id })
      }
      setResendTimer(60)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to resend OTP')
    }
  }


  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Verification Complete!</h2>
            <p className="text-gray-600 mb-6">
              Your account has been successfully verified. Redirecting to dashboard...
            </p>
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-teal-600 rounded-xl flex items-center justify-center">
              <Dog className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
              PetConnect
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Account</h1>
          <p className="text-gray-600">
            {step === 'phone' 
              ? 'Enter the code sent to your phone' 
              : 'Enter the code sent to your email'}
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`flex items-center gap-2 ${step === 'phone' ? 'text-purple-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'phone' ? 'bg-purple-100' : 'bg-green-100'
              }`}>
                {step === 'phone' ? <Phone className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              </div>
              <span className="text-sm font-medium">Phone</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center gap-2 ${step === 'email' ? 'text-purple-600' : step === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'email' ? 'bg-purple-100' : step === 'complete' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Email</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Phone OTP Form */}
          {step === 'phone' && (
            <form onSubmit={handleVerifyPhone} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  Enter 6-digit code
                </label>
                <div className="flex gap-2 justify-center">
                  {phoneOTP.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-phone-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value, true)}
                      onKeyDown={(e) => handleKeyDown(index, e, true)}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-teal-600 hover:shadow-lg hover:scale-105 transition-all ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify Phone'
                )}
              </button>

              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend code in <span className="font-semibold text-purple-600">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleResend('phone')}
                    className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Email OTP Form */}
          {step === 'email' && (
            <form onSubmit={handleVerifyEmail} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  Enter 6-digit code
                </label>
                <div className="flex gap-2 justify-center">
                  {emailOTP.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-email-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value, false)}
                      onKeyDown={(e) => handleKeyDown(index, e, false)}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-teal-600 hover:shadow-lg hover:scale-105 transition-all ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify Email'
                )}
              </button>

              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend code in <span className="font-semibold text-purple-600">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleResend('email')}
                    className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, FileText, Camera, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ImageUpload from '../components/ImageUpload'
import {
  uploadIdFront,
  uploadIdBack,
  uploadSelfie,
  submitVerification,
  getVerificationStatus
} from '../lib/verificationClient'

export default function Verification() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form data
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null)
  const [idBackFile, setIdBackFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [nationalIdNumber, setNationalIdNumber] = useState('')

  // Previews
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null)
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null)
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null)

  // Verification status
  const [verificationStatus, setVerificationStatus] = useState<any>(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Check current verification status
    loadVerificationStatus()
  }, [user, navigate])

  const loadVerificationStatus = async () => {
    try {
      const response = await getVerificationStatus()
      setVerificationStatus(response.data)

      // If already approved, redirect to dashboard
      if (response.data.adminApproval.status === 'approved') {
        navigate(user?.role === 'walker' ? '/walker/dashboard' : '/owner/dashboard')
      }
    } catch (error: any) {
      console.error('Error loading verification status:', error)
    }
  }

  const handleIdFrontSelect = (file: File) => {
    setIdFrontFile(file)
    setIdFrontPreview(URL.createObjectURL(file))
  }

  const handleIdBackSelect = (file: File) => {
    setIdBackFile(file)
    setIdBackPreview(URL.createObjectURL(file))
  }

  const handleSelfieSelect = (file: File) => {
    setSelfieFile(file)
    setSelfiePreview(URL.createObjectURL(file))
  }

  const handleUploadIdFront = async () => {
    if (!idFrontFile) {
      setError('Please select ID front image')
      return
    }

    setLoading(true)
    setError('')

    try {
      await uploadIdFront(idFrontFile)
      setSuccess('ID front uploaded successfully')
      setStep(2)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to upload ID front')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadIdBack = async () => {
    if (!idBackFile) {
      setError('Please select ID back image')
      return
    }

    setLoading(true)
    setError('')

    try {
      await uploadIdBack(idBackFile)
      setSuccess('ID back uploaded successfully')
      setStep(3)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to upload ID back')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSelfie = async () => {
    if (!selfieFile) {
      setError('Please take a selfie or select an image')
      return
    }

    setLoading(true)
    setError('')

    try {
      await uploadSelfie(selfieFile)
      setSuccess('Selfie uploaded successfully')
      setStep(4)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to upload selfie')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nationalIdNumber) {
      setError('Please enter your National ID number')
      return
    }

    if (!/^\d{8}$/.test(nationalIdNumber)) {
      setError('National ID number must be 8 digits')
      return
    }

    setLoading(true)
    setError('')

    try {
      await submitVerification(nationalIdNumber)
      setSuccess('Verification submitted successfully! Please wait for admin review.')
      setStep(5)
      
      // Reload status
      await loadVerificationStatus()
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to submit verification')
    } finally {
      setLoading(false)
    }
  }

  // Show status if already submitted
  if (verificationStatus && verificationStatus.adminApproval.status !== 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                verificationStatus.adminApproval.status === 'approved'
                  ? 'bg-green-100'
                  : verificationStatus.adminApproval.status === 'rejected'
                  ? 'bg-red-100'
                  : 'bg-yellow-100'
              }`}>
                {verificationStatus.adminApproval.status === 'approved' ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : verificationStatus.adminApproval.status === 'rejected' ? (
                  <AlertCircle className="w-10 h-10 text-red-600" />
                ) : (
                  <Loader2 className="w-10 h-10 text-yellow-600 animate-spin" />
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {verificationStatus.adminApproval.status === 'approved'
                  ? 'Verification Approved!'
                  : verificationStatus.adminApproval.status === 'rejected'
                  ? 'Verification Rejected'
                  : 'Verification Under Review'}
              </h2>
              
              <p className="text-gray-600">
                {verificationStatus.adminApproval.status === 'approved'
                  ? 'Your account has been verified. You can now access all features.'
                  : verificationStatus.adminApproval.status === 'rejected'
                  ? 'Your verification was rejected. Please review the reason and resubmit.'
                  : 'Your documents are being reviewed by our admin team. This usually takes 24-48 hours.'}
              </p>
            </div>

            {verificationStatus.adminApproval.status === 'rejected' && verificationStatus.adminApproval.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                <p className="text-sm text-red-700">{verificationStatus.adminApproval.rejectionReason}</p>
              </div>
            )}

            <div className="flex gap-4">
              {verificationStatus.adminApproval.status === 'approved' && (
                <button
                  onClick={() => navigate(user?.role === 'walker' ? '/walker/dashboard' : '/owner/dashboard')}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Go to Dashboard
                </button>
              )}
              
              {verificationStatus.adminApproval.status === 'rejected' && (
                <button
                  onClick={() => {
                    setStep(1)
                    setVerificationStatus(null)
                  }}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Resubmit Verification
                </button>
              )}
              
              {verificationStatus.adminApproval.status === 'under_review' && (
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Back to Home
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Verification</h1>
          <p className="text-gray-600">
            Please upload your documents to verify your identity
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                  step >= s
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 mx-2 transition-colors ${
                    step > s ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>ID Front</span>
            <span>ID Back</span>
            <span>Selfie</span>
            <span>Submit</span>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{success}</p>
          </motion.div>
        )}

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Upload ID Front</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Please upload a clear photo of the front of your National ID card
              </p>
              <ImageUpload
                label="ID Front Image"
                onImageSelect={handleIdFrontSelect}
                preview={idFrontPreview}
              />
              <button
                onClick={handleUploadIdFront}
                disabled={!idFrontFile || loading}
                className="w-full mt-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Uploading...' : 'Continue'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Upload ID Back</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Please upload a clear photo of the back of your National ID card
              </p>
              <ImageUpload
                label="ID Back Image"
                onImageSelect={handleIdBackSelect}
                preview={idBackPreview}
              />
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleUploadIdBack}
                  disabled={!idBackFile || loading}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Uploading...' : 'Continue'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Camera className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Take a Selfie</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Please take a selfie while holding your ID card next to your face
              </p>
              <ImageUpload
                label="Selfie with ID"
                onImageSelect={handleSelfieSelect}
                preview={selfiePreview}
                allowCamera={true}
              />
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleUploadSelfie}
                  disabled={!selfieFile || loading}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Uploading...' : 'Continue'}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Enter ID Number</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Please enter your National ID number (8 digits)
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  National ID Number
                </label>
                <input
                  type="text"
                  value={nationalIdNumber}
                  onChange={(e) => setNationalIdNumber(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="12345678"
                  maxLength={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be 8 digits
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!nationalIdNumber || loading}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Submitting...' : 'Submit for Review'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}

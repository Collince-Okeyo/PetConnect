import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, XCircle, User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react'
import AdminLayout from '../layouts/AdminLayout'
import { getVerificationDetails, approveVerification, rejectVerification } from '../../../lib/verificationClient'

export default function VerificationDetail() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [reviewNotes, setReviewNotes] = useState('')

  useEffect(() => {
    loadUserDetails()
  }, [userId])

  const loadUserDetails = async () => {
    try {
      const response = await getVerificationDetails(userId!)
      setUser(response.data.user)
    } catch (error) {
      console.error('Error loading user details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this verification?')) return

    setProcessing(true)
    try {
      await approveVerification(userId!, reviewNotes)
      alert('Verification approved successfully!')
      navigate('/admin/verifications')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to approve verification')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    setProcessing(true)
    try {
      await rejectVerification(userId!, rejectionReason, reviewNotes)
      alert('Verification rejected')
      navigate('/admin/verifications')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject verification')
    } finally {
      setProcessing(false)
      setShowRejectModal(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">User not found</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/verifications')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Verification Review</h1>
            <p className="text-gray-600 mt-1">Review and approve/reject user verification</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">User Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium text-gray-900 capitalize">{user.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="font-medium text-gray-900">
                      {user.idVerification?.submittedAt
                        ? new Date(user.idVerification.submittedAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ID Number */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">ID Information</h2>
              <div>
                <p className="text-sm text-gray-500">National ID Number</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {user.idVerification?.nationalIdNumber || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="lg:col-span-2 space-y-6">
            {/* ID Front */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ID Front</h3>
              {user.idVerification?.idFrontImage ? (
                <img
                  src={user.idVerification.idFrontImage.startsWith('http') ? user.idVerification.idFrontImage : import.meta.env.VITE_ID_URL + user.idVerification.idFrontImage}
                  alt="ID Front"
                  className="w-full h-auto rounded-lg border border-gray-200"
                />
              ) : (
                <p className="text-gray-500">No image uploaded</p>
              )}
            </div>

            {/* ID Back */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ID Back</h3>
              {user.idVerification?.idBackImage ? (
                <img
                  src={user.idVerification.idBackImage.startsWith('http') ? user.idVerification.idBackImage : import.meta.env.VITE_ID_URL + user.idVerification.idBackImage}
                  alt="ID Back"
                  className="w-full h-auto rounded-lg border border-gray-200"
                />
              ) : (
                <p className="text-gray-500">No image uploaded</p>
              )}
            </div>

            {/* Selfie */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selfie with ID</h3>
              {user.selfieVerification?.selfieWithIdImage ? (
                <img
                  src={user.selfieVerification.selfieWithIdImage.startsWith('http') ? user.selfieVerification.selfieWithIdImage : import.meta.env.VITE_ID_URL + user.selfieVerification.selfieWithIdImage}
                  alt="Selfie"
                  className="w-full h-auto rounded-lg border border-gray-200"
                />
              ) : (
                <p className="text-gray-500">No image uploaded</p>
              )}
            </div>

            {/* Review Notes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Notes (Optional)</h3>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add any notes about this verification..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Actions */}
            {user.adminApproval.status === 'under_review' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex gap-4">
                  <button
                    onClick={handleApprove}
                    disabled={processing}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {processing ? 'Processing...' : 'Approve Verification'}
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={processing}
                    className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Verification
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Verification</h3>
              <p className="text-gray-600 mb-4">Please provide a reason for rejecting this verification:</p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., ID image is blurry, selfie doesn't match ID, etc."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim() || processing}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {processing ? 'Rejecting...' : 'Confirm Reject'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

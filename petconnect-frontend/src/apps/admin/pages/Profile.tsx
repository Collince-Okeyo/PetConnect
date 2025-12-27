import AdminLayout from '../layouts/AdminLayout'
import { Mail, Phone, Edit, Camera, X, Save, Loader, Shield, Activity } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { api } from '../../../lib/api'
import { useAuth } from '../../../context/AuthContext'

export default function Profile() {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users/profile')

      console.log('Admin profile response:', response.data)

      if (response.data.success) {
        // API returns { success: true, data: { user: {...} } }
        setUser(response.data.data.user)
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    try {
      setUploading(true)
      setError('')

      const formData = new FormData()
      formData.append('profilePicture', file)

      const response = await api.post('/users/upload-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        // Update user with new profile picture path
        setUser({ ...user, profilePicture: response.data.data.profilePicture })
      }
    } catch (err: any) {
      console.error('Error uploading image:', err)
      setError(err.response?.data?.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const permissions = [
    'User Management',
    'Pet Management',
    'Walk Management',
    'Payment Management',
    'Analytics Access',
    'Settings Control',
    'Complaint Resolution',
    'System Configuration'
  ]

  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-gray-600 mt-1">Manage your administrator account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:5000/${user.profilePicture}`}
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-5xl font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name || 'Admin User'}</h2>
                <p className="text-gray-600 mb-2">System Administrator</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-600">Full Access</span>
                </div>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{user?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{user?.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Total Users" value="1,234" />
              <StatCard title="Total Walks" value="3,456" />
              <StatCard title="Revenue" value="KES 2.4M" />
              <StatCard title="Active Today" value="456" />
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <InfoItem label="Username" value={user?.email?.split('@')[0] || 'admin'} />
                <InfoItem label="Email" value={user?.email || 'N/A'} />
                <InfoItem label="Role" value="System Administrator" />
                <InfoItem label="Account Created" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} />
                <InfoItem label="Last Login" value={new Date().toLocaleString()} />
                <InfoItem label="Two-Factor Auth" value="Enabled" status="success" />
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
              <div className="grid grid-cols-2 gap-3">
                {permissions.map((permission) => (
                  <div key={permission} className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">{permission}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Actions</h3>
              <div className="space-y-3">
                <ActionItem action="Updated platform settings" time="2 hours ago" />
                <ActionItem action="Resolved complaint #C123" time="5 hours ago" />
                <ActionItem action="Approved new walker" time="1 day ago" />
                <ActionItem action="Generated monthly report" time="2 days ago" />
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && user && (
          <EditProfileModal
            user={user}
            onClose={() => setShowEditModal(false)}
            onSave={(updatedUser) => {
              setUser(updatedUser)
              setShowEditModal(false)
            }}
          />
        )}
      </div>
    </AdminLayout>
  )
}

interface StatCardProps {
  title: string
  value: string
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-gray-600 text-xs font-medium mb-1">{title}</h3>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface InfoItemProps {
  label: string
  value: string
  status?: string
}

function InfoItem({ label, value, status }: InfoItemProps) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-medium ${status === 'success' ? 'text-green-600' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  )
}

interface ActionItemProps {
  action: string
  time: string
}

function ActionItem({ action, time }: ActionItemProps) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{action}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  )
}

interface EditProfileModalProps {
  user: any
  onClose: () => void
  onSave: (user: any) => void
}

function EditProfileModal({ user, onClose, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setError('')

      const response = await api.put('/users/update', {
        name: formData.name,
        phone: formData.phone
      })

      if (response.data.success) {
        onSave(response.data.data)
      }
    } catch (err: any) {
      console.error('Error updating profile:', err)
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-indigo-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Email and role cannot be changed for security reasons. Contact system administrator for assistance.
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

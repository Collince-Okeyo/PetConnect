import AdminLayout from '../layouts/AdminLayout'
import { Search, Filter, UserPlus, MoreVertical, CheckCircle, XCircle, Clock, X, Mail, Phone, MapPin, Calendar, Shield, Ban } from 'lucide-react'
import { useState, useEffect } from 'react'
import { api } from '../../../lib/api'

export default function Users() {
  const [filter, setFilter] = useState('all')
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  // Fetch users from API
  useEffect(() => {
    fetchUsers()
  }, [filter, pagination.current])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      
      const params: any = {
        page: pagination.current,
        limit: 10
      }
      
      if (filter !== 'all') {
        params.role = filter === 'owners' ? 'owner' : 'walker'
      }

      const response = await api.get('/users', { params })
      
      if (response.data.success) {
        setUsers(response.data.data.users)
        setPagination(response.data.data.pagination)
      }
    } catch (err: any) {
      console.error('Error fetching users:', err)
      setError(err.response?.data?.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats from users data
  const stats = {
    total: pagination.total,
    owners: users.filter(u => u.role === 'owner').length,
    walkers: users.filter(u => u.role === 'walker').length,
    pending: users.filter(u => !u.isVerified).length
  }

  // Filter users by search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  )

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current: page }))
  }

  const handleViewUser = async (userId: string) => {
    try {
      setShowModal(true)
      setSelectedUser({ loading: true }) // Show loading state
      
      console.log('Fetching user details for ID:', userId)
      const response = await api.get(`/users/${userId}`)
      console.log('User details response:', response.data)
      
      if (response.data.success) {
        // API returns { success: true, data: { user: {...} } }
        setSelectedUser(response.data.data.user)
      } else {
        console.error('API returned success: false')
        setError('Failed to load user details')
        setShowModal(false)
      }
    } catch (err: any) {
      console.error('Error fetching user details:', err)
      console.error('Error response:', err.response?.data)
      setError(err.response?.data?.message || 'Failed to fetch user details')
      setShowModal(false)
      setSelectedUser(null)
    }
  }

  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage pet owners and walkers</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.total.toString()} color="blue" />
          <StatCard title="Pet Owners" value={stats.owners.toString()} color="purple" />
          <StatCard title="Pet Walkers" value={stats.walkers.toString()} color="teal" />
          <StatCard title="Pending Verification" value={stats.pending.toString()} color="yellow" />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('owners')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'owners'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Owners
              </button>
              <button
                onClick={() => setFilter('walkers')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'walkers'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Walkers
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        Loading users...
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <UserRow
                      key={user._id}
                      userId={user._id}
                      name={user.name}
                      email={user.email}
                      phone={user.phone}
                      role={user.role}
                      status={user.isVerified ? 'verified' : 'pending'}
                      joinedDate={new Date(user.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                      onView={handleViewUser}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{((pagination.current - 1) * 10) + 1}</span> to{' '}
            <span className="font-medium">{Math.min(pagination.current * 10, pagination.total)}</span> of{' '}
            <span className="font-medium">{pagination.total}</span> results
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => handlePageChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    pagination.current === page
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            <button 
              onClick={() => handlePageChange(pagination.current + 1)}
              disabled={pagination.current === pagination.pages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        {/* User Detail Modal */}
        {showModal && selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => {
              setShowModal(false)
              setSelectedUser(null)
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
  color: string
}

function StatCard({ title, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    teal: 'bg-teal-100 text-teal-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface UserRowProps {
  userId: string
  name: string
  email: string
  phone: string
  role: string
  status: string
  joinedDate: string
  onView: (userId: string) => void
}

function UserRow({ userId, name, email, phone, role, status, joinedDate, onView }: UserRowProps) {
  const statusColors = {
    verified: 'bg-green-100 text-green-600',
    pending: 'bg-yellow-100 text-yellow-600',
    suspended: 'bg-red-100 text-red-600',
  }

  const roleColors = {
    owner: 'bg-purple-100 text-purple-600',
    walker: 'bg-teal-100 text-teal-600',
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {name.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[role as keyof typeof roleColors]}`}>
          {role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{email}</div>
        <div className="text-sm text-gray-500">{phone}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${statusColors[status as keyof typeof statusColors]}`}>
          {status === 'verified' && <CheckCircle className="w-3 h-3" />}
          {status === 'pending' && <Clock className="w-3 h-3" />}
          {status === 'suspended' && <XCircle className="w-3 h-3" />}
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {joinedDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          onClick={() => onView(userId)}
          className="text-indigo-600 hover:text-indigo-900 mr-3"
        >
          View
        </button>
        <button className="text-gray-600 hover:text-gray-900">
          <MoreVertical className="w-5 h-5" />
        </button>
      </td>
    </tr>
  )
}

interface UserDetailModalProps {
  user: any
  onClose: () => void
}

function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  if (!user) return null

  // Show loading state
  if (user.loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading user details...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-indigo-400 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* User Profile Section */}
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{user.name || 'Unknown User'}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === 'owner' ? 'bg-purple-100 text-purple-600' : 'bg-teal-100 text-teal-600'
                }`}>
                  {user.role || 'N/A'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                  user.isVerified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {user.isVerified ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {user.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{user.phone || 'N/A'}</span>
                </div>
                {user.location?.address && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{user.location.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    }) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-600 text-sm font-medium mb-1">Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.rating && typeof user.rating === 'number' ? user.rating.toFixed(1) : 'N/A'}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-green-600 text-sm font-medium mb-1">Total Walks</p>
              <p className="text-2xl font-bold text-gray-900">{user.totalWalks || 0}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-purple-600 text-sm font-medium mb-1">Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{user.totalReviews || 0}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-yellow-600 text-sm font-medium mb-1">Status</p>
              <p className="text-sm font-semibold text-gray-900">{user.status || 'active'}</p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Additional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Account ID:</span>
                <span className="ml-2 font-mono text-gray-900">{user._id || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Last Active:</span>
                <span className="ml-2 text-gray-900">
                  {user.lastActive ? new Date(user.lastActive).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Email Verified:</span>
                <span className="ml-2 text-gray-900">{user.isVerified ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="text-gray-600">Phone Verified:</span>
                <span className="ml-2 text-gray-900">{user.phoneVerified ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />
              {user.isVerified ? 'Revoke Verification' : 'Verify User'}
            </button>
            <button className="flex-1 py-3 border-2 border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-all flex items-center justify-center gap-2">
              <Ban className="w-5 h-5" />
              Suspend User
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

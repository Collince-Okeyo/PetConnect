import AdminLayout from '../layouts/AdminLayout'
import { Search, MapPin, Clock, DollarSign, CheckCircle, AlertCircle, XCircle, Loader, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'
import { api } from '../../../lib/api'
import Toast from '../../../components/Toast'

interface Walk {
  _id: string
  pet: {
    _id: string
    name: string
    breed: string
  }
  owner: {
    _id: string
    name: string
    email: string
  }
  walker?: {
    _id: string
    name: string
    email: string
  }
  scheduledDate: string
  scheduledTime: string
  duration: number
  price: number
  status: string
  pickupLocation?: string
  dropoffLocation?: string
  specialInstructions?: string
}

interface Stats {
  total: number
  active: number
  completedToday: number
  cancelled: number
}

export default function Walks() {
  const [walks, setWalks] = useState<Walk[]>([])
  const [filteredWalks, setFilteredWalks] = useState<Walk[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedWalk, setSelectedWalk] = useState<Walk | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    completedToday: 0,
    cancelled: 0
  })
  const [toast, setToast] = useState<{show: boolean, type: 'success' | 'error', message: string}>({
    show: false,
    type: 'success',
    message: ''
  })

  useEffect(() => {
    fetchWalks()
  }, [])

  useEffect(() => {
    filterWalks()
  }, [filter, searchQuery, walks])

  const fetchWalks = async () => {
    try {
      setLoading(true)
      // Fetch all walks (admin can see all)
      const response = await api.get('/walks/my-walks')
      
      if (response.data.success) {
        const allWalks = response.data.data.walks
        setWalks(allWalks)
        calculateStats(allWalks)
      }
    } catch (err: any) {
      console.error('Error fetching walks:', err)
      showToast('error', 'Failed to load walks')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (allWalks: Walk[]) => {
    const today = new Date().toDateString()
    
    const stats = {
      total: allWalks.length,
      active: allWalks.filter(w => w.status === 'confirmed' || w.status === 'in-progress').length,
      completedToday: allWalks.filter(w => {
        const walkDate = new Date(w.scheduledDate).toDateString()
        return w.status === 'completed' && walkDate === today
      }).length,
      cancelled: allWalks.filter(w => w.status === 'cancelled').length
    }
    
    setStats(stats)
  }

  const filterWalks = () => {
    let filtered = [...walks]

    // Apply status filter
    if (filter !== 'all') {
      if (filter === 'active') {
        filtered = filtered.filter(w => w.status === 'confirmed' || w.status === 'in-progress' || w.status === 'pending')
      } else if (filter === 'completed') {
        filtered = filtered.filter(w => w.status === 'completed')
      } else if (filter === 'cancelled') {
        filtered = filtered.filter(w => w.status === 'cancelled')
      }
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(w => 
        w.pet.name.toLowerCase().includes(query) ||
        w.owner.name.toLowerCase().includes(query) ||
        w.walker?.name.toLowerCase().includes(query)
      )
    }

    setFilteredWalks(filtered)
  }

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message })
  }

  const handleViewDetails = (walk: Walk) => {
    setSelectedWalk(walk)
    setShowModal(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="ml-2 text-gray-600">Loading walks...</span>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Walk Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all walks</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Walks" value={stats.total.toString()} color="blue" />
          <StatCard title="Active Now" value={stats.active.toString()} color="green" />
          <StatCard title="Completed Today" value={stats.completedToday.toString()} color="purple" />
          <StatCard title="Cancelled" value={stats.cancelled.toString()} color="red" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by pet name, owner, or walker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'active' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'cancelled' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        {/* Walks Table */}
        {filteredWalks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">No walks found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Walk ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet & Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Walker</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredWalks.map((walk) => (
                    <WalkRow
                      key={walk._id}
                      walk={walk}
                      formatDate={formatDate}
                      formatTime={formatTime}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Info */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredWalks.length}</span> of <span className="font-medium">{walks.length}</span> walks
          </p>
        </div>

        {/* Walk Details Modal */}
        {showModal && selectedWalk && (
          <WalkDetailsModal
            walk={selectedWalk}
            formatDate={formatDate}
            formatTime={formatTime}
            onClose={() => {
              setShowModal(false)
              setSelectedWalk(null)
            }}
          />
        )}

        {/* Toast Notification */}
        <Toast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, type: 'success', message: '' })}
        />
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
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface WalkRowProps {
  walk: Walk
  formatDate: (date: string) => string
  formatTime: (time: string) => string
  onViewDetails: (walk: Walk) => void
}

function WalkRow({ walk, formatDate, formatTime, onViewDetails }: WalkRowProps) {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-600', icon: <AlertCircle className="w-3 h-3" />, label: 'Pending' },
    unassigned: { color: 'bg-orange-100 text-orange-600', icon: <AlertCircle className="w-3 h-3" />, label: 'Unassigned' },
    confirmed: { color: 'bg-green-100 text-green-600', icon: <CheckCircle className="w-3 h-3" />, label: 'Confirmed' },
    'in-progress': { color: 'bg-blue-100 text-blue-600', icon: <MapPin className="w-3 h-3" />, label: 'In Progress' },
    completed: { color: 'bg-purple-100 text-purple-600', icon: <CheckCircle className="w-3 h-3" />, label: 'Completed' },
    cancelled: { color: 'bg-red-100 text-red-600', icon: <XCircle className="w-3 h-3" />, label: 'Cancelled' },
  }

  const config = statusConfig[walk.status as keyof typeof statusConfig] || statusConfig.pending

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-gray-900">#{walk._id.slice(-6).toUpperCase()}</span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{walk.pet.name}</div>
        <div className="text-sm text-gray-500">{walk.owner.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{walk.walker?.name || 'Unassigned'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatDate(walk.scheduledDate)}</div>
        <div className="text-sm text-gray-500">{formatTime(walk.scheduledTime)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900 flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-400" />
          {walk.duration} mins
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-gray-400" />
          KES {walk.price.toFixed(0)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${config.color}`}>
          {config.icon}
          {config.label}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button 
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium inline-flex items-center gap-1"
          onClick={() => onViewDetails(walk)}
        >
          <Eye className="w-4 h-4" />
          View
        </button>
      </td>
    </tr>
  )
}

interface WalkDetailsModalProps {
  walk: Walk
  formatDate: (date: string) => string
  formatTime: (time: string) => string
  onClose: () => void
}

function WalkDetailsModal({ walk, formatDate, formatTime, onClose }: WalkDetailsModalProps) {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-600', label: 'Pending' },
    unassigned: { color: 'bg-orange-100 text-orange-600', label: 'Unassigned' },
    confirmed: { color: 'bg-green-100 text-green-600', label: 'Confirmed' },
    'in-progress': { color: 'bg-blue-100 text-blue-600', label: 'In Progress' },
    completed: { color: 'bg-purple-100 text-purple-600', label: 'Completed' },
    cancelled: { color: 'bg-red-100 text-red-600', label: 'Cancelled' },
  }

  const config = statusConfig[walk.status as keyof typeof statusConfig] || statusConfig.pending

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Walk Details</h3>
            <p className="text-indigo-100 text-sm mt-1">Walk ID: #{walk._id.slice(-6).toUpperCase()}</p>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Pet Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Pet Information</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Pet Name</p>
                    <p className="text-sm font-medium text-gray-900">{walk.pet.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Breed</p>
                    <p className="text-sm font-medium text-gray-900">{walk.pet.breed}</p>
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Owner Information</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">{walk.owner.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{walk.owner.email}</p>
                  </div>
                </div>
              </div>

              {/* Walker Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Walker Information</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">{walk.walker?.name || 'Unassigned'}</p>
                  </div>
                  {walk.walker && (
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">{walk.walker.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Schedule</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(walk.scheduledDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="text-sm font-medium text-gray-900">{formatTime(walk.scheduledTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium text-gray-900">{walk.duration} minutes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Location Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Pickup Location</p>
                  <p className="text-sm font-medium text-gray-900">{walk.pickupLocation || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Dropoff Location</p>
                  <p className="text-sm font-medium text-gray-900">{walk.dropoffLocation || 'Same as pickup'}</p>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {walk.specialInstructions && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Special Instructions</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{walk.specialInstructions}</p>
              </div>
            )}

            {/* Payment & Status */}
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-2xl font-bold text-indigo-600">KES {walk.price.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Status</p>
                <span className={`px-4 py-2 rounded-full text-sm font-medium inline-block ${config.color}`}>
                  {config.label}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

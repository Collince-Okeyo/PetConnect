import OwnerLayout from '../layouts/OwnerLayout'
import { Search, Calendar, Clock, DollarSign, CheckCircle, AlertCircle, XCircle, Loader, MapPin, X } from 'lucide-react'
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
  startedAt?: string
  completedAt?: string
  estimatedEndTime?: string
}

interface Stats {
  total: number
  upcoming: number
  inProgress: number
  completed: number
}

export default function MyBookings() {
  const [walks, setWalks] = useState<Walk[]>([])
  const [filteredWalks, setFilteredWalks] = useState<Walk[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedWalk, setSelectedWalk] = useState<Walk | null>(null)
  const [cancellationReason, setCancellationReason] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [stats, setStats] = useState<Stats>({
    total: 0,
    upcoming: 0,
    inProgress: 0,
    completed: 0
  })
  const [toast, setToast] = useState<{show: boolean, type: 'success' | 'error', message: string}>({
    show: false,
    type: 'success',
    message: ''
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWalks()
  }, [])

  useEffect(() => {
    filterWalks()
  }, [filter, searchQuery, walks])

  const fetchWalks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/walks/my-walks')
      
      if (response.data.success) {
        const allWalks = response.data.data.walks || []
        setWalks(allWalks)
        calculateStats(allWalks)
      }
    } catch (err: any) {
      console.error('Error fetching walks:', err)
      setError(err.response?.data?.message || 'Failed to load bookings')
      showToast('error', 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (allWalks: Walk[]) => {
    if (!allWalks || !Array.isArray(allWalks)) {
      return
    }
    
    const now = new Date()
    
    const stats = {
      total: allWalks.length,
      upcoming: allWalks.filter(w => {
        const walkDate = new Date(w.scheduledDate)
        return (w.status === 'pending' || w.status === 'confirmed') && walkDate >= now
      }).length,
      inProgress: allWalks.filter(w => w.status === 'in-progress').length,
      completed: allWalks.filter(w => w.status === 'completed').length
    }
    
    setStats(stats)
  }

  const filterWalks = () => {
    let filtered = [...walks]

    // Apply status filter
    if (filter !== 'all') {
      if (filter === 'upcoming') {
        const now = new Date()
        filtered = filtered.filter(w => {
          const walkDate = new Date(w.scheduledDate)
          return (w.status === 'pending' || w.status === 'confirmed' || w.status === 'unassigned') && walkDate >= now
        })
      } else if (filter === 'in-progress') {
        filtered = filtered.filter(w => w.status === 'in-progress')
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
        w.walker?.name.toLowerCase().includes(query)
      )
    }

    setFilteredWalks(filtered)
  }

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message })
  }

  const handleCancelClick = (walk: Walk) => {
    console.log('Cancel button clicked for walk:', walk._id)
    console.log('Setting modal to show...')
    setSelectedWalk(walk)
    setShowCancelModal(true)
    setCancellationReason('')
    console.log('Modal should be visible now')
  }

  const handleCancelWalk = async () => {
    if (!selectedWalk) return

    try {
      setCancelling(true)
      const response = await api.put(`/walks/${selectedWalk._id}/cancel-by-owner`, {
        cancellationReason
      })

      if (response.data.success) {
        showToast('success', 'Walk cancelled successfully')
        setShowCancelModal(false)
        setSelectedWalk(null)
        setCancellationReason('')
        fetchWalks() // Refresh the list
      }
    } catch (err: any) {
      console.error('Error cancelling walk:', err)
      showToast('error', err.response?.data?.message || 'Failed to cancel walk')
    } finally {
      setCancelling(false)
    }
  }

  const canCancelWalk = (walk: Walk) => {
    return walk.status !== 'in-progress' && walk.status !== 'completed' && walk.status !== 'cancelled'
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
      <OwnerLayout>
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading bookings...</span>
        </div>
      </OwnerLayout>
    )
  }

  if (error) {
    return (
      <OwnerLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-900 font-bold mb-2">Error Loading Bookings</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchWalks}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </OwnerLayout>
    )
  }

  return (
    <OwnerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">View and manage your walk bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Bookings" value={stats.total.toString()} color="blue" icon={<Calendar className="w-6 h-6" />} />
          <StatCard title="Upcoming" value={stats.upcoming.toString()} color="yellow" icon={<Clock className="w-6 h-6" />} />
          <StatCard title="In Progress" value={stats.inProgress.toString()} color="green" icon={<MapPin className="w-6 h-6" />} />
          <StatCard title="Completed" value={stats.completed.toString()} color="purple" icon={<CheckCircle className="w-6 h-6" />} />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by pet or walker name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'upcoming' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('in-progress')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'in-progress' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'completed' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'cancelled' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredWalks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">No bookings found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredWalks.map((walk) => (
              <WalkCard
                key={walk._id}
                walk={walk}
                formatDate={formatDate}
                formatTime={formatTime}
                canCancel={canCancelWalk(walk)}
                onCancel={() => handleCancelClick(walk)}
              />
            ))}
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && selectedWalk && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-opacity-50"
              onClick={() => !cancelling && setShowCancelModal(false)}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full z-50">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Cancel Walk</h3>
                  <button
                    onClick={() => !cancelling && setShowCancelModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={cancelling}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="text-gray-600 mb-4">
                  Are you sure you want to cancel this walk for <strong>{selectedWalk.pet.name}</strong>?
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for cancellation (optional)
                  </label>
                  <textarea
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                    placeholder="Let us know why you're cancelling..."
                    disabled={cancelling}
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={cancelling}
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={handleCancelWalk}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={cancelling}
                  >
                    {cancelling ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      'Cancel Walk'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        <Toast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, type: 'success', message: '' })}
        />
      </div>
    </OwnerLayout>
  )
}

interface StatCardProps {
  title: string
  value: string
  color: string
  icon: React.ReactNode
}

function StatCard({ title, value, color, icon }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface WalkCardProps {
  walk: Walk
  formatDate: (date: string) => string
  formatTime: (time: string) => string
  canCancel: boolean
  onCancel: () => void
}

function WalkCard({ walk, formatDate, formatTime, canCancel, onCancel }: WalkCardProps) {
  console.log('Is True: ', canCancel)
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-600 border-yellow-200', icon: <AlertCircle className="w-4 h-4" />, label: 'Pending' },
    unassigned: { color: 'bg-orange-100 text-orange-600 border-orange-200', icon: <AlertCircle className="w-4 h-4" />, label: 'Unassigned' },
    confirmed: { color: 'bg-green-100 text-green-600 border-green-200', icon: <CheckCircle className="w-4 h-4" />, label: 'Confirmed' },
    'in-progress': { color: 'bg-blue-100 text-blue-600 border-blue-200', icon: <MapPin className="w-4 h-4" />, label: 'In Progress' },
    completed: { color: 'bg-purple-100 text-purple-600 border-purple-200', icon: <CheckCircle className="w-4 h-4" />, label: 'Completed' },
    cancelled: { color: 'bg-red-100 text-red-600 border-red-200', icon: <XCircle className="w-4 h-4" />, label: 'Cancelled' },
  }

  const config = statusConfig[walk.status as keyof typeof statusConfig] || statusConfig.pending

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{walk.pet.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${config.color}`}>
              {config.icon}
              {config.label}
            </span>
          </div>
          <p className="text-sm text-gray-500">{walk.pet.breed}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-purple-600">KES {walk.price.toFixed(0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{formatDate(walk.scheduledDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{formatTime(walk.scheduledTime)} ({walk.duration} mins)</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{walk.pickupLocation || 'Not specified'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span className="text-sm">Walker: {walk.walker?.name || 'Unassigned'}</span>
        </div>
      </div>

      {walk.specialInstructions && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-500 mb-1">Special Instructions</p>
          <p className="text-sm text-gray-700">{walk.specialInstructions}</p>
        </div>
      )}

      {canCancel && (
        <button
          onClick={() => {
            console.log('Cancel button clicked!')
            onCancel()
          }}
          className="w-full py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          Cancel Booking
        </button>
      )}

      {walk.status === 'in-progress' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
          <Loader className="w-4 h-4 animate-spin text-blue-600" />
          <span className="text-sm text-blue-700 font-medium">Walk in progress...</span>
        </div>
      )}
    </div>
  )
}

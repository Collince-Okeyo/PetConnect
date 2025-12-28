import WalkerLayout from '../layouts/WalkerLayout'
import { Calendar, Clock, MapPin, DollarSign, Check, X, Loader } from 'lucide-react'
import { useState, useEffect } from 'react'
import { api } from '../../../lib/api'
import Toast from '../../../components/Toast'

interface Walk {
  _id: string
  pet: {
    _id: string
    name: string
    breed: string
    petType: {
      name: string
      icon: string
    }
    photos?: Array<{
      url: string
    }>
  }
  owner: {
    _id: string
    name: string
    email: string
    phone?: string
  }
  scheduledDate: string
  scheduledTime: string
  duration: number
  price: number
  specialInstructions?: string
  pickupLocation?: string
  dropoffLocation?: string
  status: string
  startedAt?: string
  completedAt?: string
  estimatedEndTime?: string
  createdAt?: string
}

type TabType = 'pending' | 'confirmed' | 'completed'

export default function Requests() {
  const [activeTab, setActiveTab] = useState<TabType>('pending')
  const [walks, setWalks] = useState<Walk[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{show: boolean, type: 'success' | 'error', message: string}>({
    show: false,
    type: 'success',
    message: ''
  })

  useEffect(() => {
    fetchWalkRequests()
  }, [activeTab])

  const fetchWalkRequests = async () => {
    try {
      setLoading(true)
      console.log('Fetching walks with status:', activeTab)
      const response = await api.get(`/walks/my-walks?status=${activeTab}`)
      console.log('Response:', response)
      console.log('Response data:', response.data)
      
      if (response.data.success) {
        let filteredWalks = response.data.data.walks
        console.log('Walks before filtering:', filteredWalks.length)

        // Filter out past requests for pending tab
        if (activeTab === 'pending') {
          const now = new Date()
          filteredWalks = filteredWalks.filter((walk: Walk) => {
            const walkDateTime = new Date(`${walk.scheduledDate}T${walk.scheduledTime}`)
            const isPast = walkDateTime < now
            console.log('Walk:', walk.pet?.name, 'Date:', walk.scheduledDate, 'Time:', walk.scheduledTime, 'Is past?', isPast)
            return !isPast
          })
          console.log('Walks after filtering:', filteredWalks.length)
        }

        // Sort by date (latest first - descending order)
        filteredWalks.sort((a: Walk, b: Walk) => {
          const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`)
          const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`)
          return dateB.getTime() - dateA.getTime()
        })

        console.log('Final walks to display:', filteredWalks.length)
        setWalks(filteredWalks)
      }
    } catch (err: any) {
      console.error('Error fetching walk requests:', err)
      console.error('Error response:', err.response)
      showToast('error', 'Failed to load walk requests')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message })
  }

  const handleAccept = async (walkId: string) => {
    try {
      setProcessingId(walkId)
      const response = await api.put(`/walks/${walkId}/accept`)
      
      if (response.data.success) {
        showToast('success', 'Walk request accepted!')
        fetchWalkRequests() // Refresh the list
      }
    } catch (err: any) {
      console.error('Error accepting walk:', err)
      showToast('error', err.response?.data?.message || 'Failed to accept walk')
    } finally {
      setProcessingId(null)
    }
  }

  const handleDecline = async (walkId: string) => {
    try {
      setProcessingId(walkId)
      const response = await api.put(`/walks/${walkId}/decline`)
      
      if (response.data.success) {
        showToast('success', 'Walk request declined')
        fetchWalkRequests() // Refresh the list
      }
    } catch (err: any) {
      console.error('Error declining walk:', err)
      showToast('error', err.response?.data?.message || 'Failed to decline walk')
    } finally {
      setProcessingId(null)
    }
  }

  const handleStartWalk = async (walkId: string) => {
    try {
      setProcessingId(walkId)
      const response = await api.put(`/walks/${walkId}/start`)
      
      if (response.data.success) {
        showToast('success', 'Walk started! Timer is running.')
        fetchWalkRequests() // Refresh the list
      }
    } catch (err: any) {
      console.error('Error starting walk:', err)
      showToast('error', err.response?.data?.message || 'Failed to start walk')
    } finally {
      setProcessingId(null)
    }
  }

  const handleCompleteWalk = async (walkId: string) => {
    try {
      setProcessingId(walkId)
      const response = await api.put(`/walks/${walkId}/complete`)
      
      if (response.data.success) {
        showToast('success', 'Walk completed successfully!')
        fetchWalkRequests() // Refresh the list
      }
    } catch (err: any) {
      console.error('Error completing walk:', err)
      showToast('error', err.response?.data?.message || 'Failed to complete walk')
    } finally {
      setProcessingId(null)
    }
  }

  // Calculate stats
  const pendingCount = walks.length

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
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
      <WalkerLayout>
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-teal-600" />
          <span className="ml-2 text-gray-600">Loading requests...</span>
        </div>
      </WalkerLayout>
    )
  }

  return (
    <WalkerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Walk Requests</h1>
          <p className="text-gray-600 mt-1">Review and manage your walk requests</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'pending'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Requests
              </button>
              <button
                onClick={() => setActiveTab('confirmed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'confirmed'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'completed'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed
              </button>
            </nav>
          </div>
        </div>

        {/* Stats - Only show for pending */}
        {activeTab === 'pending' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Pending Requests" value={pendingCount.toString()} />
            <StatCard title="Upcoming" value={walks.filter(w => {
              const walkDate = new Date(`${w.scheduledDate}T${w.scheduledTime}`)
              const tomorrow = new Date()
              tomorrow.setDate(tomorrow.getDate() + 1)
              return walkDate > tomorrow
            }).length.toString()} />
            <StatCard title="Today" value={walks.filter(w => {
              const walkDate = new Date(w.scheduledDate)
              const today = new Date()
              return walkDate.toDateString() === today.toDateString()
            }).length.toString()} />
          </div>
        )}

        {/* Requests List */}
        {walks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">
              {activeTab === 'pending' && 'No pending walk requests'}
              {activeTab === 'confirmed' && 'No confirmed walks'}
              {activeTab === 'completed' && 'No completed walks'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {activeTab === 'pending' && 'New requests will appear here'}
              {activeTab === 'confirmed' && 'Accepted walks will appear here'}
              {activeTab === 'completed' && 'Completed walks will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {walks.map((walk) => (
              <RequestCard
                key={walk._id}
                walk={walk}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onStart={handleStartWalk}
                onComplete={handleCompleteWalk}
                isProcessing={processingId === walk._id}
                formatDate={formatDate}
                formatTime={formatTime}
                showActions={activeTab === 'pending'}
              />
            ))}
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
    </WalkerLayout>
  )
}

interface StatCardProps {
  title: string
  value: string
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface RequestCardProps {
  walk: Walk
  onAccept: (walkId: string) => void
  onDecline: (walkId: string) => void
  onStart?: (walkId: string) => void
  onComplete?: (walkId: string) => void
  isProcessing: boolean
  formatDate: (date: string) => string
  formatTime: (time: string) => string
  showActions: boolean
}

function RequestCard({ walk, onAccept, onDecline, onStart, onComplete, isProcessing, formatDate, formatTime, showActions }: RequestCardProps) {
  const [elapsedTime, setElapsedTime] = useState(0)

  // Timer for in-progress walks
  useEffect(() => {
    if (walk.status === 'in-progress' && walk.startedAt) {
      const interval = setInterval(() => {
        const started = new Date(walk.startedAt!).getTime()
        const now = new Date().getTime()
        setElapsedTime(Math.floor((now - started) / 1000))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [walk.status, walk.startedAt])

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  const petIcon = walk.pet.photos && walk.pet.photos.length > 0
    ? `http://localhost:5000/${walk.pet.photos[0].url}`
    : walk.pet.petType.icon

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center text-4xl overflow-hidden">
            {walk.pet.photos && walk.pet.photos.length > 0 ? (
              <img src={petIcon} alt={walk.pet.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              petIcon
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{walk.pet.name}</h3>
            <p className="text-sm text-gray-600">{walk.pet.breed}</p>
            <p className="text-xs text-gray-500">Owner: {walk.owner.name}</p>
          </div>
        </div>
        <span className="text-2xl font-bold text-teal-600">KES {walk.price.toFixed(0)}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(walk.scheduledDate)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Time</p>
            <p className="text-sm font-medium text-gray-900">{formatTime(walk.scheduledTime)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-sm font-medium text-gray-900">{walk.duration} mins</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Contact</p>
            <p className="text-sm font-medium text-gray-900">{walk.owner.phone || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Pickup Location */}
      {walk.pickupLocation && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
          <p className="text-sm font-medium text-gray-900">{walk.pickupLocation}</p>
        </div>
      )}

      {/* Dropoff Location */}
      {walk.dropoffLocation && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Dropoff Location</p>
          <p className="text-sm font-medium text-gray-900">{walk.dropoffLocation}</p>
        </div>
      )}

      {walk.specialInstructions && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Special Notes</p>
          <p className="text-sm text-gray-700">{walk.specialInstructions}</p>
        </div>
      )}

      {/* Timer for in-progress walks */}
      {walk.status === 'in-progress' && (
        <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium mb-1">Walk in Progress</p>
              <p className="text-2xl font-bold text-blue-700">{formatElapsedTime(elapsedTime)}</p>
            </div>
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      )}

      {/* Actions based on status */}
      {showActions && (
        <div className="flex gap-3">
          <button 
            onClick={() => onDecline(walk._id)}
            disabled={isProcessing}
            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <X className="w-5 h-5" />
                Decline
              </>
            )}
          </button>
          <button 
            onClick={() => onAccept(walk._id)}
            disabled={isProcessing}
            className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5" />
                Accept
              </>
            )}
          </button>
        </div>
      )}

      {/* Start Walk button for confirmed walks */}
      {walk.status === 'confirmed' && onStart && (
        <button
          onClick={() => onStart(walk._id)}
          disabled={isProcessing}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <MapPin className="w-5 h-5" />
              Start Walk
            </>
          )}
        </button>
      )}

      {/* Complete Walk button for in-progress walks */}
      {walk.status === 'in-progress' && onComplete && (
        <button
          onClick={() => onComplete(walk._id)}
          disabled={isProcessing}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Check className="w-5 h-5" />
              Complete Walk
            </>
          )}
        </button>
      )}
    </div>
  )
}

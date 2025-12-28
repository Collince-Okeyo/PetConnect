import WalkerLayout from '../layouts/WalkerLayout'
import { MapPin, Clock, Phone, MessageSquare, CheckCircle, Loader, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { api } from '../../../lib/api'
import { useLocationTracking } from '../../../hooks/useLocationTracking'
import WalkerActiveWalkMap from '../../../components/maps/WalkerActiveWalkMap'
import Toast from '../../../components/Toast'

interface Walk {
  _id: string
  pet: {
    _id: string
    name: string
  }
  owner: {
    _id: string
    name: string
    phone?: string
    profilePicture?: string
  }
  status: string
  startedAt: string
  duration: number
  price: number
}

interface LocationData {
  currentLocation: { latitude: number; longitude: number; timestamp: string } | null
  route: Array<{ latitude: number; longitude: number; timestamp: string }>
  totalDistance: number
  duration: number
}

export default function ActiveWalks() {
  const [activeWalk, setActiveWalk] = useState<Walk | null>(null)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [toast, setToast] = useState<{show: boolean, type: 'success' | 'error', message: string}>({
    show: false,
    type: 'success',
    message: ''
  })

  // GPS tracking
  const { location, error: gpsError, permissionGranted } = useLocationTracking({
    walkId: activeWalk?._id || '',
    isTracking: activeWalk?.status === 'in-progress',
    updateInterval: 10000 // 10 seconds
  })

  useEffect(() => {
    fetchActiveWalk()
  }, [])

  // Fetch location data periodically
  useEffect(() => {
    if (activeWalk) {
      fetchLocationData()
      const interval = setInterval(fetchLocationData, 5000) // Every 5 seconds
      return () => clearInterval(interval)
    }
  }, [activeWalk])

  const fetchActiveWalk = async () => {
    try {
      setLoading(true)
      const response = await api.get('/walks/my-walks?status=in-progress')
      
      if (response.data.success && response.data.data.walks.length > 0) {
        setActiveWalk(response.data.data.walks[0])
      }
    } catch (err: any) {
      console.error('Error fetching active walk:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchLocationData = async () => {
    if (!activeWalk) return
    
    try {
      const response = await api.get(`/walks/${activeWalk._id}/location`)
      if (response.data.success) {
        setLocationData(response.data.data)
      }
    } catch (err: any) {
      console.error('Error fetching location:', err)
    }
  }

  const handleCompleteWalk = async () => {
    if (!activeWalk) return

    try {
      setCompleting(true)
      const response = await api.put(`/walks/${activeWalk._id}/complete`)
      
      if (response.data.success) {
        showToast('success', 'Walk completed successfully!')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (err: any) {
      console.error('Error completing walk:', err)
      showToast('error', err.response?.data?.message || 'Failed to complete walk')
    } finally {
      setCompleting(false)
    }
  }

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <WalkerLayout>
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-teal-600" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </WalkerLayout>
    )
  }

  if (!activeWalk) {
    return (
      <WalkerLayout>
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Active Walks</h1>
            <p className="text-gray-600 mt-1">Your ongoing walks</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Walks</h3>
            <p className="text-gray-600">You don't have any ongoing walks at the moment</p>
          </div>
        </div>
      </WalkerLayout>
    )
  }

  const elapsedTime = locationData?.duration || 0

  return (
    <WalkerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Active Walk</h1>
          <p className="text-gray-600 mt-1">Walking {activeWalk.pet.name}</p>
        </div>

        {/* GPS Permission Warning */}
        {/* {!permissionGranted && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-yellow-900">GPS Permission Required</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Please enable location permissions to track this walk
                </p>
                <div className="mt-3 text-sm text-yellow-800">
                  <p className="font-medium mb-2">How to enable:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Chrome/Edge:</strong> Click the lock icon in the address bar → Site settings → Location → Allow</li>
                    <li><strong>Firefox:</strong> Click the shield/lock icon → Permissions → Location → Allow</li>
                    <li><strong>Safari:</strong> Safari menu → Settings → Websites → Location → Allow for this website</li>
                    <li><strong>Mobile:</strong> Go to device Settings → Apps → Browser → Permissions → Location → Allow</li>
                  </ul>
                  <p className="mt-2 text-xs">After enabling, refresh the page to start tracking.</p>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* GPS Error */}
        {gpsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">GPS Error</p>
              <p className="text-sm text-red-700 mt-1">{gpsError}</p>
            </div>
          </div>
        )}

        {/* Battery Usage Warning */}
        {permissionGranted && activeWalk.status === 'in-progress' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">GPS Tracking Active</p>
              <p className="text-sm text-blue-700 mt-1">
                Continuous GPS tracking may impact battery life. Consider keeping your device charged during long walks.
              </p>
            </div>
          </div>
        )}

        {/* Connection Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${location ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {location ? 'GPS Connected' : 'Waiting for GPS...'}
                </p>
                <p className="text-xs text-gray-500">
                  {location 
                    ? `Updating every 10 seconds • ${locationData?.route.length || 0} points tracked`
                    : 'Attempting to acquire GPS signal'
                  }
                </p>
              </div>
            </div>
            {locationData?.currentLocation?.timestamp && (
              <p className="text-xs text-gray-500">
                Last: {new Date(locationData.currentLocation.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>


        {/* Active Walk Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Walking {activeWalk.pet.name}</h2>
              <p className="text-sm text-gray-500">
                Started {new Date(activeWalk.startedAt).toLocaleTimeString()}
              </p>
            </div>
            <span className="px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
              In Progress
            </span>
          </div>

          {/* Map */}
          <div className="h-150 mb-6 rounded-lg overflow-hidden">
            <WalkerActiveWalkMap
              currentLocation={location || locationData?.currentLocation || null}
              route={locationData?.route || []}
              petName={activeWalk.pet.name}
            />
          </div>

          {/* Walk Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-semibold text-gray-900">{formatDuration(elapsedTime)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Distance</p>
                <p className="font-semibold text-gray-900">
                  {locationData?.totalDistance.toFixed(2) || '0.00'} km
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Earnings</p>
                <p className="font-semibold text-gray-900">KES {activeWalk.price.toFixed(0)}</p>
              </div>
            </div>
          </div>

          {/* Owner Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex items-center gap-4">
              {activeWalk.owner.profilePicture ? (
                <img
                  src={`http://localhost:5000/${activeWalk.owner.profilePicture}`}
                  alt={activeWalk.owner.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  {activeWalk.owner.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">{activeWalk.owner.name}</p>
                <p className="text-sm text-gray-500">Pet Owner</p>
              </div>
            </div>
            <div className="flex gap-2">
              {activeWalk.owner.phone && (
                <a
                  href={`tel:${activeWalk.owner.phone}`}
                  className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <Phone className="w-5 h-5 text-gray-600" />
                </a>
              )}
              <button className="p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all">
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Complete Walk Button */}
          <button
            onClick={handleCompleteWalk}
            disabled={completing}
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {completing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Complete Walk
              </>
            )}
          </button>
        </div>

        {/* Toast */}
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

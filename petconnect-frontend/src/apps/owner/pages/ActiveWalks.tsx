import OwnerLayout from '../layouts/OwnerLayout'
import { MapPin, Clock, Phone, MessageSquare, Loader } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../../lib/api'
import OwnerActiveWalkMap from '../../../components/maps/OwnerActiveWalkMap'

interface Walk {
  _id: string
  pet: {
    _id: string
    name: string
  }
  walker: {
    _id: string
    name: string
    phone?: string
    profilePicture?: string
  }
  status: string
  startedAt: string
  duration: number
}

interface LocationData {
  currentLocation: { latitude: number; longitude: number; timestamp: string } | null
  route: Array<{ latitude: number; longitude: number; timestamp: string }>
  totalDistance: number
  duration: number
}

export default function ActiveWalks() {
  const navigate = useNavigate()
  const [activeWalk, setActiveWalk] = useState<Walk | null>(null)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPhoneMenu, setShowPhoneMenu] = useState(false)
console.log('Data: ', locationData)
  useEffect(() => {
    fetchActiveWalk()
  }, [])

  // Poll for location updates
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </OwnerLayout>
    )
  }

  if (!activeWalk) {
    return (
      <OwnerLayout>
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Active Walks</h1>
            <p className="text-gray-600 mt-1">Track your pet's ongoing walks in real-time</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Walks</h3>
            <p className="text-gray-600 mb-6">You don't have any ongoing walks at the moment</p>
            <button
              onClick={() => window.location.href = '/owner/book-walk'}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Book a Walk
            </button>
          </div>
        </div>
      </OwnerLayout>
    )
  }

  const elapsedTime = locationData?.duration || 0

  return (
    <OwnerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Active Walk</h1>
          <p className="text-gray-600 mt-1">Track {activeWalk.pet.name}'s walk in real-time</p>
        </div>

        {/* Active Walk Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{activeWalk.pet.name}'s Walk</h2>
              <p className="text-sm text-gray-500">
                Started {new Date(activeWalk.startedAt).toLocaleTimeString()}
              </p>
            </div>
            <span className="px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
              Live
            </span>
          </div>

        {/* Connection Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${locationData?.currentLocation ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {locationData?.currentLocation ? 'Live Tracking Active' : 'Waiting for location...'}
                </p>
                <p className="text-xs text-gray-500">
                  {locationData?.currentLocation 
                    ? `Updates every 5 seconds • ${locationData.route.length} points tracked`
                    : 'Walker will appear on map once GPS is acquired'
                  }
                </p>
              </div>
            </div>
            {locationData?.currentLocation?.timestamp && (
              <p className="text-xs text-gray-500">
                Last update: {new Date(locationData.currentLocation.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>


          {/* Map */}
          <div className="h-150 mb-6 rounded-lg overflow-hidden">
            <OwnerActiveWalkMap
              currentLocation={locationData?.currentLocation || null}
              route={locationData?.route || []}
              petName={activeWalk.pet.name}
              walkerName={activeWalk.walker.name}
            />
          </div>

          {/* Walk Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
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
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Location</p>
                <p className="font-semibold text-gray-900">
                  {locationData?.currentLocation ? 'Tracking...' : 'Waiting...'}
                </p>
              </div>
            </div>
          </div>

          {/* Last Update */}
          {locationData?.currentLocation?.timestamp && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-700">
                Last updated: {new Date(locationData.currentLocation.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}

          {/* Walker Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              {activeWalk.walker.profilePicture ? (
                <img
                  src={`http://localhost:5000/${activeWalk.walker.profilePicture}`}
                  alt={activeWalk.walker.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {activeWalk.walker.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">{activeWalk.walker.name}</p>
                <p className="text-sm text-gray-500">Professional Walker</p>
              </div>
            </div>
            <div className="flex gap-2">
              {activeWalk.walker.phone && (
                <div className="relative">
                  <button
                    onClick={() => setShowPhoneMenu(!showPhoneMenu)}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  {showPhoneMenu && (
                    <div className="absolute bottom-full right-0 mb-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
                      <a
                        href={`tel:${activeWalk.walker.phone}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowPhoneMenu(false)}
                      >
                        📞 Call
                      </a>
                      <a
                        href={`https://wa.me/${activeWalk.walker.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowPhoneMenu(false)}
                      >
                        💬 WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              )}
              <button 
                onClick={() => navigate(`/owner/messages?chat=${activeWalk.walker._id}`)}
                className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </OwnerLayout>
  )
}

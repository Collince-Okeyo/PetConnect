import OwnerLayout from '../layouts/OwnerLayout'
import { Clock, DollarSign, Star, Calendar, Loader } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../../../lib/api'
import Toast from '../../../components/Toast'

interface Pet {
  _id: string
  name: string
  breed: string
  petType: {
    name: string
    icon: string
  }
}

interface Walker {
  _id: string
  name: string
  email: string
  phone?: string
  profilePicture?: string
  rating?: {
    average: number
    count: number
  }
  totalWalks?: number
  location?: string
}

export default function BookWalk() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const petIdFromUrl = searchParams.get('petId')

  const [pets, setPets] = useState<Pet[]>([])
  const [walkers, setWalkers] = useState<Walker[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [selectedPet, setSelectedPet] = useState(petIdFromUrl || '')
  const [selectedWalker, setSelectedWalker] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [duration, setDuration] = useState(30)
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')
  
  const [toast, setToast] = useState<{show: boolean, type: 'success' | 'error', message: string}>({
    show: false,
    type: 'success',
    message: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [petsRes, walkersRes] = await Promise.all([
        api.get('/pets'),
        api.get('/walks/walkers/available')
      ])

      if (petsRes.data.success) {
        setPets(petsRes.data.data.pets)
      }

      if (walkersRes.data.success) {
        setWalkers(walkersRes.data.data.walkers)
      }
    } catch (err: any) {
      console.error('Error fetching data:', err)
      showToast('error', 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message })
  }

  const calculatePrice = () => {
    const baseRate = 300 // KES per 30 minutes
    return (baseRate / 30) * duration
  }

  const handleSubmit = async () => {
    // Validation
    if (!selectedPet) {
      showToast('error', 'Please select a pet')
      return
    }
    if (!selectedDate) {
      showToast('error', 'Please select a date')
      return
    }
    if (!selectedTime) {
      showToast('error', 'Please select a time')
      return
    }
    if (!pickupLocation) {
      showToast('error', 'Please enter pickup location')
      return
    }

    // Check if date is in the future
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`)
    if (selectedDateTime < new Date()) {
      showToast('error', 'Please select a future date and time')
      return
    }

    try {
      setSubmitting(true)
      const response = await api.post('/walks/book', {
        petId: selectedPet,
        walkerId: selectedWalker || undefined, // Optional
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        duration,
        specialInstructions,
        pickupLocation,
        dropoffLocation
      })

      if (response.data.success) {
        showToast('success', 'Walk booked successfully!')
        setTimeout(() => {
          navigate('/owner/my-bookings')
        }, 2000)
      }
    } catch (err: any) {
      console.error('Error booking walk:', err)
      showToast('error', err.response?.data?.message || 'Failed to book walk')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedPetData = pets.find(p => p._id === selectedPet)
  const selectedWalkerData = walkers.find(w => w._id === selectedWalker)

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

  return (
    <OwnerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book a Walk</h1>
          <p className="text-gray-600 mt-1">Find a walker and schedule a walk for your pet</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Walk Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Pet *</label>
                  <select
                    value={selectedPet}
                    onChange={(e) => setSelectedPet(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Choose a pet...</option>
                    {pets.map(pet => (
                      <option key={pet._id} value={pet._id}>
                        {pet.petType.icon} {pet.name} ({pet.breed})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[30, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => setDuration(mins)}
                        type="button"
                        className={`py-3 rounded-lg font-medium transition-all ${
                          duration === mins
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {mins} mins
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location *</label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="e.g., Westlands, Nairobi"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dropoff Location (Optional)</label>
                  <input
                    type="text"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    placeholder="Same as pickup if not specified"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                  <textarea
                    rows={3}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special instructions for the walker..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                    maxLength={500}
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">{specialInstructions.length}/500 characters</p>
                </div>
              </div>
            </div>

            {/* Available Walkers */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Available Walkers</h2>
                <span className="text-xs text-gray-500">Optional - You can book without selecting a walker</span>
              </div>
              {walkers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No walkers available at the moment</p>
              ) : (
                <div className="space-y-4">
                  {walkers.map(walker => (
                    <WalkerCard
                      key={walker._id}
                      walker={walker}
                      isSelected={selectedWalker === walker._id}
                      onSelect={() => setSelectedWalker(walker._id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white sticky top-24">
              <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-purple-100">Pet</span>
                  <span className="font-semibold">{selectedPetData ? selectedPetData.name : 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-100">Walker</span>
                  <span className="font-semibold">{selectedWalkerData ? selectedWalkerData.name : 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-100">Date</span>
                  <span className="font-semibold">{selectedDate || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-100">Time</span>
                  <span className="font-semibold">{selectedTime || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-100">Duration</span>
                  <span className="font-semibold">{duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-100">Pickup</span>
                  <span className="font-semibold text-right">{pickupLocation || 'Not set'}</span>
                </div>
                {dropoffLocation && (
                  <div className="flex justify-between">
                    <span className="text-purple-100">Dropoff</span>
                    <span className="font-semibold text-right">{dropoffLocation}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-purple-400 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg">Total</span>
                  <span className="text-2xl font-bold">KES {calculatePrice().toFixed(0)}</span>
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>

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

interface WalkerCardProps {
  walker: Walker
  isSelected: boolean
  onSelect: () => void
}

function WalkerCard({ walker, isSelected, onSelect }: WalkerCardProps) {
  const profileImage = walker.profilePicture 
    ? import.meta.env.VITE_APP_URL + walker.profilePicture 
    : null
  return (
    <div className={`flex items-center gap-4 p-4 border-2 rounded-lg transition-all cursor-pointer ${
      isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
    }`}
    onClick={onSelect}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 overflow-hidden">
        {profileImage ? (
          <img src={profileImage} alt={walker.name} className="w-full h-full object-cover" />
        ) : (
          walker.name.charAt(0).toUpperCase()
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{walker.name}</h4>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{walker.rating ? walker.rating.average.toFixed(1) : '5.0'}</span>
            <span className="text-sm text-gray-500">({walker.totalWalks || 0} walks)</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-purple-600">KES 500</p>
        <button 
          className={`mt-2 px-4 py-1 rounded-lg text-sm font-medium transition-all ${
            isSelected 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
    </div>
  )
}

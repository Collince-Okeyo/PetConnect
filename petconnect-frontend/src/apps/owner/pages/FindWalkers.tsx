import OwnerLayout from '../layouts/OwnerLayout'
import { Search, MapPin, Star, Calendar, DollarSign } from 'lucide-react'
import { useState, useEffect } from 'react'
import { api } from '../../../lib/api'

export default function FindWalkers() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [walkers, setWalkers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchWalkers()
  }, [filter, searchQuery])

  const fetchWalkers = async () => {
    try {
      setLoading(true)
      const params: any = {}
      
      if (searchQuery) {
        params.search = searchQuery
      }
      
      if (filter === 'nearby') {
        params.sortBy = 'distance'
      } else if (filter === 'top-rated') {
        params.sortBy = 'rating'
      }

      const response = await api.get('/walks/walkers/available', { params })
      console.log(response.data)
      if (response.data.success) {
        setWalkers(response.data.data.walkers || [])
      }
    } catch (err: any) {
      console.error('Error fetching walkers:', err)
      setError(err.response?.data?.message || 'Failed to load walkers')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchWalkers()
  }

  return (
    <OwnerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Walkers</h1>
          <p className="text-gray-600 mt-1">Discover trusted pet walkers near you</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter('nearby')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'nearby' ? 'bg-purple-600 text-white' : 'bg-gray-100'
                }`}
              >
                Nearby
              </button>
              <button
                type="button"
                onClick={() => setFilter('top-rated')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'top-rated' ? 'bg-purple-600 text-white' : 'bg-gray-100'
                }`}
              >
                Top Rated
              </button>
            </div>
          </form>
        </div>

        {/* Walkers Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="ml-3 text-gray-600">Loading walkers...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : walkers.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">No walkers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {walkers.map((walker) => (
              <WalkerCard
                key={walker._id}
                id={walker._id}
                name={walker.name}
                profilePicture={walker.profilePicture}
                rating={Number(walker.rating || 0).toFixed(1)}
                reviews={walker.totalReviews?.toString() || '0'}
                distance={walker.distance ? `${Number(walker.distance).toFixed(1)} km` : 'N/A'}
                experience={walker.experience || 'New'}
                price={`KES ${walker.hourlyRate || 500}`}
                availability={walker.isAvailable ? 'Available Today' : 'Busy'}
                specialties={walker.specialties || ['Dogs']}
              />
            ))}
          </div>
        )}
      </div>
    </OwnerLayout>
  )
}

interface WalkerCardProps {
  id: string
  name: string
  profilePicture?: string
  rating: string
  reviews: string
  distance: string
  experience: string
  price: string
  availability: string
  specialties: string[]
}

function WalkerCard({ id, name, profilePicture, rating, reviews, distance, experience, price, availability, specialties }: WalkerCardProps) {
  const isAvailable = availability.includes('Available')

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        {profilePicture ? (
          <img
            src={profilePicture.startsWith('http') ? profilePicture : `${import.meta.env.VITE_APP_URL}${profilePicture}`}
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {name.charAt(0)}
          </div>
        )}
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          isAvailable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {availability}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
      
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">{rating}</span>
          <span className="text-sm text-gray-500">({reviews})</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="w-4 h-4" />
          {distance}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Experience</span>
          <span className="font-medium text-gray-900">{experience}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Price</span>
          <span className="font-semibold text-purple-600">{price}/walk</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Specialties</p>
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty, index) => (
            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
              {specialty}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 py-2 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all">
          View Profile
        </button>
        <button className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
          Book Now
        </button>
      </div>
    </div>
  )
}

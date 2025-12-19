import OwnerLayout from '../layouts/OwnerLayout'
import { Search, MapPin, Star, Calendar, DollarSign } from 'lucide-react'
import { useState } from 'react'

export default function FindWalkers() {
  const [filter, setFilter] = useState('all')

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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('nearby')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'nearby' ? 'bg-purple-600 text-white' : 'bg-gray-100'
                }`}
              >
                Nearby
              </button>
              <button
                onClick={() => setFilter('top-rated')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'top-rated' ? 'bg-purple-600 text-white' : 'bg-gray-100'
                }`}
              >
                Top Rated
              </button>
            </div>
          </div>
        </div>

        {/* Walkers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WalkerCard
            name="Sarah Johnson"
            rating="4.9"
            reviews="127"
            distance="1.2 km"
            experience="3 years"
            price="KES 500"
            availability="Available Today"
            specialties={['Dogs', 'Cats', 'Small Pets']}
          />
          <WalkerCard
            name="Mike Davis"
            rating="4.8"
            reviews="98"
            distance="2.1 km"
            experience="2 years"
            price="KES 550"
            availability="Available Tomorrow"
            specialties={['Dogs', 'Large Breeds']}
          />
          <WalkerCard
            name="Emma Wilson"
            rating="4.9"
            reviews="85"
            distance="3.5 km"
            experience="4 years"
            price="KES 600"
            availability="Busy"
            specialties={['Dogs', 'Puppies', 'Training']}
          />
          <WalkerCard
            name="James Brown"
            rating="4.7"
            reviews="72"
            distance="1.8 km"
            experience="1 year"
            price="KES 450"
            availability="Available Today"
            specialties={['Dogs', 'Cats']}
          />
          <WalkerCard
            name="Lisa Anderson"
            rating="4.9"
            reviews="115"
            distance="2.5 km"
            experience="5 years"
            price="KES 650"
            availability="Available Today"
            specialties={['All Pets', 'Special Needs']}
          />
          <WalkerCard
            name="Tom Wilson"
            rating="4.6"
            reviews="54"
            distance="4.2 km"
            experience="1 year"
            price="KES 400"
            availability="Available Tomorrow"
            specialties={['Dogs']}
          />
        </div>
      </div>
    </OwnerLayout>
  )
}

interface WalkerCardProps {
  name: string
  rating: string
  reviews: string
  distance: string
  experience: string
  price: string
  availability: string
  specialties: string[]
}

function WalkerCard({ name, rating, reviews, distance, experience, price, availability, specialties }: WalkerCardProps) {
  const isAvailable = availability.includes('Available')

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {name.charAt(0)}
        </div>
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

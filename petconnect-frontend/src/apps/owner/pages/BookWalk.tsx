import OwnerLayout from '../layouts/OwnerLayout'
import { MapPin, Clock, DollarSign, Star, Calendar } from 'lucide-react'
import { useState } from 'react'

export default function BookWalk() {
  const [selectedPet, setSelectedPet] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [duration, setDuration] = useState('30')

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Pet</label>
                  <select
                    value={selectedPet}
                    onChange={(e) => setSelectedPet(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Choose a pet...</option>
                    <option value="max">Max (Golden Retriever)</option>
                    <option value="bella">Bella (Labrador)</option>
                    <option value="charlie">Charlie (Beagle)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
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
                    {['30', '45', '60'].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => setDuration(mins)}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="Any special instructions for the walker..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Available Walkers */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Walkers Nearby</h2>
              <div className="space-y-4">
                <WalkerCard
                  name="Sarah Johnson"
                  rating="4.9"
                  reviews="127"
                  distance="1.2 km"
                  price="KES 500"
                  available={true}
                />
                <WalkerCard
                  name="Mike Davis"
                  rating="4.8"
                  reviews="98"
                  distance="2.1 km"
                  price="KES 550"
                  available={true}
                />
                <WalkerCard
                  name="Emma Wilson"
                  rating="4.9"
                  reviews="85"
                  distance="3.5 km"
                  price="KES 600"
                  available={false}
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white sticky top-24">
              <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-purple-100">Pet</span>
                  <span className="font-semibold">{selectedPet || 'Not selected'}</span>
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
              </div>

              <div className="border-t border-purple-400 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg">Total</span>
                  <span className="text-2xl font-bold">KES 500</span>
                </div>
              </div>

              <button className="w-full py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-purple-50 transition-all">
                Confirm Booking
              </button>
            </div>
          </div>
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
  price: string
  available: boolean
}

function WalkerCard({ name, rating, reviews, distance, price, available }: WalkerCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-all">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
        {name.charAt(0)}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-sm text-gray-500">({reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            {distance}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-purple-600">{price}</p>
        {available ? (
          <button className="mt-2 px-4 py-1 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
            Select
          </button>
        ) : (
          <span className="text-sm text-gray-500">Unavailable</span>
        )}
      </div>
    </div>
  )
}

import OwnerLayout from '../layouts/OwnerLayout'
import { MapPin, Clock, Phone, MessageSquare } from 'lucide-react'

export default function ActiveWalks() {
  return (
    <OwnerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Active Walks</h1>
          <p className="text-gray-600 mt-1">Track your pet's ongoing walks in real-time</p>
        </div>

        {/* Active Walk */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Max's Walk</h2>
              <p className="text-sm text-gray-500">Started 15 minutes ago</p>
            </div>
            <span className="px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
              Live
            </span>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg h-64 mb-6 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <p className="text-gray-600">Live tracking map will appear here</p>
            </div>
          </div>

          {/* Walk Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-semibold text-gray-900">15 / 30 mins</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Distance</p>
                <p className="font-semibold text-gray-900">1.2 km</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold text-gray-900">Westlands</p>
              </div>
            </div>
          </div>

          {/* Walker Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <p className="font-semibold text-gray-900">Sarah Johnson</p>
                <p className="text-sm text-gray-500">Professional Walker</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all">
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* No Active Walks State */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Walks</h3>
          <p className="text-gray-600 mb-6">You don't have any ongoing walks at the moment</p>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
            Book a Walk
          </button>
        </div> */}
      </div>
    </OwnerLayout>
  )
}

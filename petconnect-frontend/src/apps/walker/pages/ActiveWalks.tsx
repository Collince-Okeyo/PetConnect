import WalkerLayout from '../layouts/WalkerLayout'
import { MapPin, Clock, Phone, MessageSquare, CheckCircle } from 'lucide-react'

export default function ActiveWalks() {
  return (
    <WalkerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Active Walks</h1>
          <p className="text-gray-600 mt-1">Your ongoing walks</p>
        </div>

        {/* Active Walk */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Walking Max</h2>
              <p className="text-sm text-gray-500">Started 15 minutes ago</p>
            </div>
            <span className="px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
              In Progress
            </span>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg h-64 mb-6 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-teal-600 mx-auto mb-2" />
              <p className="text-gray-600">GPS tracking map will appear here</p>
            </div>
          </div>

          {/* Walk Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-teal-600" />
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
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Earnings</p>
                <p className="font-semibold text-gray-900">KES 500</p>
              </div>
            </div>
          </div>

          {/* Owner Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                J
              </div>
              <div>
                <p className="font-semibold text-gray-900">John Doe</p>
                <p className="text-sm text-gray-500">Pet Owner</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all">
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Complete Walk Button */}
          <button className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
            Complete Walk
          </button>
        </div>
      </div>
    </WalkerLayout>
  )
}

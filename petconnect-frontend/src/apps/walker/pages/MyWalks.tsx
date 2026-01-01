import WalkerLayout from '../layouts/WalkerLayout'
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle } from 'lucide-react'

export default function MyWalks() {
  // This would normally come from an API
  const walks = [
    {
      id: '1',
      petName: 'Max',
      petType: 'Golden Retriever',
      ownerName: 'John Doe',
      date: '2026-01-01',
      time: '3:00 PM',
      duration: '30 mins',
      location: 'Westlands, Nairobi',
      status: 'completed',
      earnings: 'KES 500'
    },
    {
      id: '2',
      petName: 'Luna',
      petType: 'Labrador',
      ownerName: 'Emma Wilson',
      date: '2025-12-31',
      time: '5:30 PM',
      duration: '45 mins',
      location: 'Kilimani, Nairobi',
      status: 'completed',
      earnings: 'KES 750'
    },
    {
      id: '3',
      petName: 'Buddy',
      petType: 'Beagle',
      ownerName: 'Sarah Johnson',
      date: '2025-12-30',
      time: '10:00 AM',
      duration: '60 mins',
      location: 'Karen, Nairobi',
      status: 'completed',
      earnings: 'KES 1,000'
    },
    {
      id: '4',
      petName: 'Charlie',
      petType: 'Poodle',
      ownerName: 'Mike Davis',
      date: '2025-12-29',
      time: '2:00 PM',
      duration: '30 mins',
      location: 'Lavington, Nairobi',
      status: 'cancelled',
      earnings: 'KES 0'
    }
  ]

  return (
    <WalkerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Walks</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">View all your completed and cancelled walks</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Walks</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">156</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Completed</p>
                <p className="text-xl md:text-2xl font-bold text-green-600 mt-1">148</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Cancelled</p>
                <p className="text-xl md:text-2xl font-bold text-red-600 mt-1">8</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Earned</p>
                <p className="text-xl md:text-2xl font-bold text-teal-600 mt-1">KES 78,500</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-teal-600">KES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Walks List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">Walk History</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {walks.map((walk) => (
              <WalkItem key={walk.id} walk={walk} />
            ))}
          </div>
        </div>
      </div>
    </WalkerLayout>
  )
}

interface WalkItemProps {
  walk: {
    id: string
    petName: string
    petType: string
    ownerName: string
    date: string
    time: string
    duration: string
    location: string
    status: string
    earnings: string
  }
}

function WalkItem({ walk }: WalkItemProps) {
  const statusColors = {
    completed: 'bg-green-100 text-green-600',
    cancelled: 'bg-red-100 text-red-600'
  }

  return (
    <div className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">{walk.petName}'s Walk</h3>
              <p className="text-sm text-gray-600">{walk.petType} • with {walk.ownerName}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{walk.date} at {walk.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{walk.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{walk.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-teal-600">{walk.earnings}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:flex-col sm:items-end">
          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[walk.status as keyof typeof statusColors]}`}>
            {walk.status.charAt(0).toUpperCase() + walk.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  )
}

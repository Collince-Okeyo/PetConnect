import WalkerLayout from '../layouts/WalkerLayout'
import { Calendar, Clock, MapPin, DollarSign, Check, X } from 'lucide-react'

export default function Requests() {
  return (
    <WalkerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Walk Requests</h1>
          <p className="text-gray-600 mt-1">Review and accept walk requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Pending Requests" value="5" />
          <StatCard title="Accepted Today" value="3" />
          <StatCard title="Declined" value="2" />
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          <RequestCard
            petName="Max"
            ownerName="John Doe"
            breed="Golden Retriever"
            date="Today"
            time="3:00 PM"
            duration="30 mins"
            price="KES 500"
            distance="1.2 km"
            location="Westlands, Nairobi"
            notes="Max loves to run and play fetch"
          />
          <RequestCard
            petName="Bella"
            ownerName="Emma Wilson"
            breed="Labrador"
            date="Tomorrow"
            time="9:00 AM"
            duration="45 mins"
            price="KES 750"
            distance="0.8 km"
            location="Kilimani, Nairobi"
            notes="Please avoid busy streets"
          />
          <RequestCard
            petName="Charlie"
            ownerName="Mike Johnson"
            breed="Beagle"
            date="Tomorrow"
            time="5:00 PM"
            duration="30 mins"
            price="KES 500"
            distance="2.1 km"
            location="Lavington, Nairobi"
            notes=""
          />
        </div>
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
  petName: string
  ownerName: string
  breed: string
  date: string
  time: string
  duration: string
  price: string
  distance: string
  location: string
  notes: string
}

function RequestCard({ petName, ownerName, breed, date, time, duration, price, distance, location, notes }: RequestCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center text-4xl">
            🐕
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{petName}</h3>
            <p className="text-sm text-gray-600">{breed}</p>
            <p className="text-xs text-gray-500">Owner: {ownerName}</p>
          </div>
        </div>
        <span className="text-2xl font-bold text-teal-600">{price}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-sm font-medium text-gray-900">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Time</p>
            <p className="text-sm font-medium text-gray-900">{time}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-sm font-medium text-gray-900">{duration}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Distance</p>
            <p className="text-sm font-medium text-gray-900">{distance}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1">Location</p>
        <p className="text-sm font-medium text-gray-900">{location}</p>
      </div>

      {notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Special Notes</p>
          <p className="text-sm text-gray-700">{notes}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
          <X className="w-5 h-5" />
          Decline
        </button>
        <button className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
          <Check className="w-5 h-5" />
          Accept
        </button>
      </div>
    </div>
  )
}

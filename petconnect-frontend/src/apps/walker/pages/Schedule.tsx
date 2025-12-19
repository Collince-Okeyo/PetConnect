import WalkerLayout from '../layouts/WalkerLayout'
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react'

export default function Schedule() {
  return (
    <WalkerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-600 mt-1">View your upcoming walks</p>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">December 2024</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
            </div>
          </div>
          
          {/* Simple Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                className={`text-center py-3 rounded-lg cursor-pointer transition-all ${
                  day === 19
                    ? 'bg-teal-600 text-white font-bold'
                    : day === 20 || day === 21
                    ? 'bg-teal-100 text-teal-600 font-medium'
                    : 'hover:bg-gray-100'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h2>
          <div className="space-y-4">
            <ScheduleItem
              time="3:00 PM"
              petName="Max"
              ownerName="John Doe"
              duration="30 mins"
              location="Westlands, Nairobi"
              status="confirmed"
              earnings="KES 500"
            />
            <ScheduleItem
              time="5:30 PM"
              petName="Luna"
              ownerName="Emma Wilson"
              duration="45 mins"
              location="Kilimani, Nairobi"
              status="confirmed"
              earnings="KES 750"
            />
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming This Week</h2>
          <div className="space-y-4">
            <ScheduleItem
              time="Tomorrow, 9:00 AM"
              petName="Bella"
              ownerName="Mike Davis"
              duration="30 mins"
              location="Lavington, Nairobi"
              status="confirmed"
              earnings="KES 500"
            />
            <ScheduleItem
              time="Dec 21, 2:00 PM"
              petName="Charlie"
              ownerName="Sarah Johnson"
              duration="60 mins"
              location="Karen, Nairobi"
              status="pending"
              earnings="KES 1,000"
            />
          </div>
        </div>
      </div>
    </WalkerLayout>
  )
}

interface ScheduleItemProps {
  time: string
  petName: string
  ownerName: string
  duration: string
  location: string
  status: string
  earnings: string
}

function ScheduleItem({ time, petName, ownerName, duration, location, status, earnings }: ScheduleItemProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-teal-100 rounded-lg flex flex-col items-center justify-center">
            <Clock className="w-5 h-5 text-teal-600 mb-1" />
            <span className="text-xs font-medium text-teal-600">{time.split(',')[0]}</span>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{petName}'s Walk</h4>
          <p className="text-sm text-gray-600">with {ownerName}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {duration}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {location}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-teal-600">{earnings}</p>
            <span className={`text-xs px-2 py-1 rounded-full ${
              status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
            }`}>
              {status}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  )
}

import WalkerLayout from '../layouts/WalkerLayout'
import { Inbox, TrendingUp, DollarSign, Star, Calendar, Clock, MapPin, CheckCircle } from 'lucide-react'

export default function WalkerDashboard() {
  return (
    <WalkerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ready to Walk!</h1>
          <p className="text-gray-600 mt-1">Manage your walks and track earnings</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Walk Requests"
            value="5"
            icon={<Inbox className="w-6 h-6" />}
            color="teal"
            trend="3 new today"
          />
          <StatCard
            title="Active Walks"
            value="1"
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
            trend="In progress"
          />
          <StatCard
            title="Today's Earnings"
            value="KES 2,450"
            icon={<DollarSign className="w-6 h-6" />}
            color="cyan"
            trend="+15% vs yesterday"
          />
          <StatCard
            title="Rating"
            value="4.8"
            icon={<Star className="w-6 h-6" />}
            color="yellow"
            trend="Based on 127 reviews"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Walk Requests */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Walk Requests</h2>
              <span className="px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-sm font-medium">
                5 Pending
              </span>
            </div>
            <div className="space-y-4">
              <WalkRequestCard
                petName="Max"
                ownerName="John Doe"
                breed="Golden Retriever"
                date="Today"
                time="3:00 PM"
                duration="30 mins"
                price="KES 500"
                distance="1.2 km away"
              />
              <WalkRequestCard
                petName="Bella"
                ownerName="Sarah Smith"
                breed="Labrador"
                date="Tomorrow"
                time="9:00 AM"
                duration="45 mins"
                price="KES 750"
                distance="0.8 km away"
              />
              <WalkRequestCard
                petName="Charlie"
                ownerName="Mike Johnson"
                breed="Beagle"
                date="Tomorrow"
                time="5:00 PM"
                duration="30 mins"
                price="KES 500"
                distance="2.1 km away"
              />
            </div>
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Earnings Card */}
            <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Total Earnings</h3>
              <p className="text-3xl font-bold mb-1">KES 45,230</p>
              <p className="text-teal-100 mb-4 text-sm">
                This month
              </p>
              <button className="w-full py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-all">
                Withdraw
              </button>
            </div>

            {/* This Week */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
              <div className="space-y-3">
                <WeekStat label="Walks Completed" value="23" />
                <WeekStat label="Hours Walked" value="18.5" />
                <WeekStat label="Distance Covered" value="42 km" />
                <WeekStat label="Earnings" value="KES 11,500" />
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h2>
          <div className="space-y-3">
            <ScheduleItem
              time="3:00 PM"
              petName="Max"
              ownerName="John Doe"
              duration="30 mins"
              location="Westlands, Nairobi"
              status="confirmed"
            />
            <ScheduleItem
              time="5:30 PM"
              petName="Luna"
              ownerName="Emma Wilson"
              duration="45 mins"
              location="Kilimani, Nairobi"
              status="confirmed"
            />
          </div>
        </div>
      </div>
    </WalkerLayout>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color: string
  trend: string
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  const colorClasses = {
    teal: 'bg-teal-100 text-teal-600',
    green: 'bg-green-100 text-green-600',
    cyan: 'bg-cyan-100 text-cyan-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
        {icon}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-xs text-gray-500">{trend}</p>
    </div>
  )
}

interface WalkRequestCardProps {
  petName: string
  ownerName: string
  breed: string
  date: string
  time: string
  duration: string
  price: string
  distance: string
}

function WalkRequestCard({ petName, ownerName, breed, date, time, duration, price, distance }: WalkRequestCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center text-2xl">
            🐕
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{petName}</h4>
            <p className="text-sm text-gray-600">{breed}</p>
            <p className="text-xs text-gray-500">Owner: {ownerName}</p>
          </div>
        </div>
        <span className="text-lg font-bold text-teal-600">{price}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="flex items-center gap-1 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{date}, {time}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
        <MapPin className="w-4 h-4" />
        <span>{distance}</span>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all">
          Decline
        </button>
        <button className="flex-1 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-all">
          Accept
        </button>
      </div>
    </div>
  )
}

interface WeekStatProps {
  label: string
  value: string
}

function WeekStat({ label, value }: WeekStatProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  )
}

interface ScheduleItemProps {
  time: string
  petName: string
  ownerName: string
  duration: string
  location: string
  status: string
}

function ScheduleItem({ time, petName, ownerName, duration, location, status }: ScheduleItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-teal-300 transition-all">
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-teal-100 rounded-lg flex flex-col items-center justify-center">
          <span className="text-xs text-teal-600 font-medium">Today</span>
          <span className="text-lg font-bold text-teal-600">{time}</span>
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
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {status}
        </span>
      </div>
    </div>
  )
}

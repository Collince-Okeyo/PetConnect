import OwnerLayout from '../layouts/OwnerLayout'
import { Dog, Calendar, MapPin, Wallet, TrendingUp, Clock } from 'lucide-react'

export default function OwnerDashboard() {
  return (
    <OwnerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 mt-1">Manage your pets and book walks</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="My Pets"
            value="3"
            icon={<Dog className="w-6 h-6" />}
            color="purple"
            trend="+1 this month"
          />
          <StatCard
            title="Upcoming Walks"
            value="2"
            icon={<Calendar className="w-6 h-6" />}
            color="blue"
            trend="Next: Tomorrow 9AM"
          />
          <StatCard
            title="Active Walks"
            value="0"
            icon={<MapPin className="w-6 h-6" />}
            color="green"
            trend="No active walks"
          />
          <StatCard
            title="Wallet Balance"
            value="KES 5,000"
            icon={<Wallet className="w-6 h-6" />}
            color="pink"
            trend="Available"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Pets */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">My Pets</h2>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                Add Pet
              </button>
            </div>
            <div className="space-y-4">
              <PetCard
                name="Max"
                breed="Golden Retriever"
                age="3 years"
                image="🐕"
              />
              <PetCard
                name="Bella"
                breed="Labrador"
                age="2 years"
                image="🦮"
              />
              <PetCard
                name="Charlie"
                breed="Beagle"
                age="4 years"
                image="🐶"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Book Walk Card */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Book a Walk</h3>
              <p className="text-purple-100 mb-4 text-sm">
                Find trusted walkers near you
              </p>
              <button className="w-full py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all">
                Book Now
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <ActivityItem
                  icon={<Clock className="w-4 h-4" />}
                  text="Walk completed with Sarah"
                  time="2 hours ago"
                />
                <ActivityItem
                  icon={<Dog className="w-4 h-4" />}
                  text="Added new pet: Charlie"
                  time="1 day ago"
                />
                <ActivityItem
                  icon={<Wallet className="w-4 h-4" />}
                  text="Wallet topped up: KES 2,000"
                  time="3 days ago"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Walks */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Walks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UpcomingWalkCard
              petName="Max"
              walkerName="Sarah Johnson"
              date="Tomorrow"
              time="9:00 AM"
              duration="30 mins"
              price="KES 500"
            />
            <UpcomingWalkCard
              petName="Bella"
              walkerName="Mike Davis"
              date="Dec 21"
              time="3:00 PM"
              duration="45 mins"
              price="KES 750"
            />
          </div>
        </div>
      </div>
    </OwnerLayout>
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
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    pink: 'bg-pink-100 text-pink-600',
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

interface PetCardProps {
  name: string
  breed: string
  age: string
  image: string
}

function PetCard({ name, breed, age, image }: PetCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-all cursor-pointer">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-3xl">
        {image}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <p className="text-sm text-gray-600">{breed}</p>
        <p className="text-xs text-gray-500">{age}</p>
      </div>
      <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-all">
        View
      </button>
    </div>
  )
}

interface ActivityItemProps {
  icon: React.ReactNode
  text: string
  time: string
}

function ActivityItem({ icon, text, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{text}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  )
}

interface UpcomingWalkCardProps {
  petName: string
  walkerName: string
  date: string
  time: string
  duration: string
  price: string
}

function UpcomingWalkCard({ petName, walkerName, date, time, duration, price }: UpcomingWalkCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{petName}'s Walk</h4>
          <p className="text-sm text-gray-600">with {walkerName}</p>
        </div>
        <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
          Confirmed
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Date & Time</p>
          <p className="text-gray-900 font-medium">{date}, {time}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Duration</p>
          <p className="text-gray-900 font-medium">{duration}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
        <span className="text-lg font-bold text-purple-600">{price}</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-all">
            Cancel
          </button>
          <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-all">
            Details
          </button>
        </div>
      </div>
    </div>
  )
}

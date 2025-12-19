import OwnerLayout from '../layouts/OwnerLayout'
import { MapPin, Mail, Phone, Edit, Dog } from 'lucide-react'

export default function Profile() {
  return (
    <OwnerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-5xl font-bold mx-auto mb-4">
                  J
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">John Doe</h2>
                <p className="text-gray-600 mb-4">Pet Owner</p>
                <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">john@example.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">+254 712 345 678</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">Westlands, Nairobi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="My Pets" value="3" />
              <StatCard title="Total Walks" value="105" />
              <StatCard title="Total Spent" value="KES 12.5K" />
              <StatCard title="Member Since" value="2023" />
            </div>

            {/* My Pets */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Pets</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PetCard name="Max" breed="Golden Retriever" age="3 years" />
                <PetCard name="Bella" breed="Labrador" age="2 years" />
                <PetCard name="Charlie" breed="Beagle" age="4 years" />
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
              <div className="space-y-3">
                <PreferenceItem label="Preferred Walk Time" value="Afternoon (3-6 PM)" />
                <PreferenceItem label="Preferred Walk Duration" value="30 minutes" />
                <PreferenceItem label="Preferred Location" value="Westlands Park" />
                <PreferenceItem label="Special Requirements" value="Avoid busy streets" />
              </div>
            </div>

            {/* Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <ActivityItem action="Booked a walk" details="Max with Sarah Johnson" time="2 hours ago" />
                <ActivityItem action="Completed walk" details="Bella with Mike Davis" time="1 day ago" />
                <ActivityItem action="Left a review" details="5 stars for Emma Wilson" time="2 days ago" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </OwnerLayout>
  )
}

interface StatCardProps {
  title: string
  value: string
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-gray-600 text-xs font-medium mb-1">{title}</h3>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface PetCardProps {
  name: string
  breed: string
  age: string
}

function PetCard({ name, breed, age }: PetCardProps) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl mb-2">
        🐕
      </div>
      <h4 className="font-semibold text-gray-900">{name}</h4>
      <p className="text-sm text-gray-600">{breed}</p>
      <p className="text-xs text-gray-500">{age}</p>
    </div>
  )
}

interface PreferenceItemProps {
  label: string
  value: string
}

function PreferenceItem({ label, value }: PreferenceItemProps) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}

interface ActivityItemProps {
  action: string
  details: string
  time: string
}

function ActivityItem({ action, details, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{action}</p>
        <p className="text-sm text-gray-600">{details}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  )
}

import WalkerLayout from '../layouts/WalkerLayout'
import { MapPin, Star, Calendar, Award, Edit } from 'lucide-react'

export default function Profile() {
  return (
    <WalkerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your professional profile</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-5xl font-bold mx-auto mb-4">
                  S
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Sarah Johnson</h2>
                <p className="text-gray-600 mb-2">Professional Pet Walker</p>
                <div className="flex items-center justify-center gap-1 mb-4">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">4.9</span>
                  <span className="text-gray-500">(127 reviews)</span>
                </div>
                <button className="w-full py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">Westlands, Nairobi</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">3 years experience</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">127 walks completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
              <p className="text-gray-700 leading-relaxed">
                I'm a passionate pet lover with over 3 years of professional dog walking experience. 
                I treat every pet as if they were my own and ensure they get the exercise and attention 
                they deserve. I'm experienced with all breeds and sizes, and I always prioritize safety 
                and fun during our walks.
              </p>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {['Dogs', 'Cats', 'Large Breeds', 'Puppies', 'Senior Pets', 'Special Needs'].map((specialty) => (
                  <span key={specialty} className="px-4 py-2 bg-teal-100 text-teal-600 rounded-full text-sm font-medium">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Total Walks" value="127" />
              <StatCard title="Total Earnings" value="KES 45K" />
              <StatCard title="Avg Rating" value="4.9" />
              <StatCard title="Response Time" value="< 1hr" />
            </div>

            {/* Availability */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div
                    key={day}
                    className={`text-center py-3 rounded-lg ${
                      index < 5 ? 'bg-teal-100 text-teal-600 font-medium' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <p className="text-xs">{day}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-3">Available Monday - Friday, 8 AM - 6 PM</p>
            </div>
          </div>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-gray-600 text-xs font-medium mb-1">{title}</h3>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

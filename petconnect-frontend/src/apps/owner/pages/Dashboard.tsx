import { Dog, Calendar, MapPin, Wallet } from 'lucide-react'

export default function OwnerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Pet Owner Dashboard
          </h1>
          <p className="text-gray-600">Manage your pets and walks</p>
        </div>
      </header>

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <QuickStat
            icon={<Dog className="w-6 h-6" />}
            label="My Pets"
            value="3"
            color="purple"
          />
          <QuickStat
            icon={<Calendar className="w-6 h-6" />}
            label="Upcoming Walks"
            value="2"
            color="blue"
          />
          <QuickStat
            icon={<MapPin className="w-6 h-6" />}
            label="Active Walks"
            value="0"
            color="green"
          />
          <QuickStat
            icon={<Wallet className="w-6 h-6" />}
            label="Wallet Balance"
            value="$50"
            color="pink"
          />
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Dog className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to PetConnect!</h2>
          <p className="text-gray-600 mb-6">Start by adding your first pet or booking a walk</p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              Add Pet
            </button>
            <button className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all">
              Book Walk
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface QuickStatProps {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}

function QuickStat({ icon, label, value, color }: QuickStatProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center text-${color}-600 mb-3`}>
        {icon}
      </div>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  )
}

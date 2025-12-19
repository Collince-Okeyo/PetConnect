import { TrendingUp, Calendar, DollarSign, Star } from 'lucide-react'

export default function WalkerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Walker Dashboard
          </h1>
          <p className="text-gray-600">Manage your walks and earnings</p>
        </div>
      </header>

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <QuickStat
            icon={<Calendar className="w-6 h-6" />}
            label="Walk Requests"
            value="5"
            color="teal"
          />
          <QuickStat
            icon={<TrendingUp className="w-6 h-6" />}
            label="Active Walks"
            value="1"
            color="green"
          />
          <QuickStat
            icon={<DollarSign className="w-6 h-6" />}
            label="Today's Earnings"
            value="$45"
            color="cyan"
          />
          <QuickStat
            icon={<Star className="w-6 h-6" />}
            label="Rating"
            value="4.8"
            color="yellow"
          />
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Walk!</h2>
          <p className="text-gray-600 mb-6">Check your walk requests and start earning</p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              View Requests
            </button>
            <button className="px-6 py-3 border-2 border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-all">
              My Schedule
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

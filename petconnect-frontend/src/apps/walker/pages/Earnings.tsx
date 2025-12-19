import WalkerLayout from '../layouts/WalkerLayout'
import { TrendingUp, DollarSign, Calendar, Download } from 'lucide-react'

export default function Earnings() {
  return (
    <WalkerLayout>
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
            <p className="text-gray-600 mt-1">Track your income and payouts</p>
          </div>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-all flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>

        {/* Total Earnings Card */}
        <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl shadow-lg p-8 text-white mb-8">
          <p className="text-teal-100 mb-2">Total Earnings</p>
          <h2 className="text-5xl font-bold mb-6">KES 45,230</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-teal-100 text-sm mb-1">This Month</p>
              <p className="text-2xl font-semibold">KES 11,500</p>
            </div>
            <div>
              <p className="text-teal-100 text-sm mb-1">This Week</p>
              <p className="text-2xl font-semibold">KES 3,200</p>
            </div>
            <div>
              <p className="text-teal-100 text-sm mb-1">Today</p>
              <p className="text-2xl font-semibold">KES 1,250</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Walks" value="127" icon={<Calendar className="w-5 h-5" />} />
          <StatCard title="Avg per Walk" value="KES 356" icon={<DollarSign className="w-5 h-5" />} />
          <StatCard title="Pending Payout" value="KES 2,450" icon={<TrendingUp className="w-5 h-5" />} />
          <StatCard title="Next Payout" value="Dec 25" icon={<Calendar className="w-5 h-5" />} />
        </div>

        {/* Earnings Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Earnings Overview (Last 7 Days)</h3>
          <div className="h-64 flex items-end justify-between gap-3">
            {[
              { day: 'Mon', amount: 1200 },
              { day: 'Tue', amount: 800 },
              { day: 'Wed', amount: 1500 },
              { day: 'Thu', amount: 900 },
              { day: 'Fri', amount: 1800 },
              { day: 'Sat', amount: 1400 },
              { day: 'Sun', amount: 2100 },
            ].map((item, index) => {
              const maxAmount = 2100
              const height = (item.amount / maxAmount) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-3">
                  <div className="relative w-full group">
                    <div
                      className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        KES {item.amount}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{item.day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Earnings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Earnings</h3>
          <div className="space-y-4">
            <EarningItem
              petName="Max"
              ownerName="John Doe"
              date="Dec 19, 2024"
              time="3:00 PM"
              duration="30 mins"
              amount="KES 500"
              status="completed"
            />
            <EarningItem
              petName="Bella"
              ownerName="Emma Wilson"
              date="Dec 18, 2024"
              time="9:00 AM"
              duration="45 mins"
              amount="KES 750"
              status="completed"
            />
            <EarningItem
              petName="Charlie"
              ownerName="Mike Davis"
              date="Dec 17, 2024"
              time="5:00 PM"
              duration="30 mins"
              amount="KES 500"
              status="pending"
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
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600">
          {icon}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface EarningItemProps {
  petName: string
  ownerName: string
  date: string
  time: string
  duration: string
  amount: string
  status: string
}

function EarningItem({ petName, ownerName, date, time, duration, amount, status }: EarningItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center text-2xl">
          🐕
        </div>
        <div>
          <p className="font-semibold text-gray-900">{petName}'s Walk</p>
          <p className="text-sm text-gray-600">{ownerName}</p>
          <p className="text-xs text-gray-500">{date} • {time} • {duration}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-teal-600">{amount}</p>
        <span className={`text-xs px-2 py-1 rounded-full ${
          status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
        }`}>
          {status}
        </span>
      </div>
    </div>
  )
}

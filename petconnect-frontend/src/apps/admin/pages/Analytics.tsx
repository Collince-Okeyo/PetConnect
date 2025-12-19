import AdminLayout from '../layouts/AdminLayout'
import { TrendingUp, Users, DollarSign, Dog } from 'lucide-react'

export default function Analytics() {
  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Business insights and performance metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value="KES 2.4M"
            change="+12.5%"
            trend="up"
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
          />
          <MetricCard
            title="Active Users"
            value="1,234"
            change="+8.2%"
            trend="up"
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <MetricCard
            title="Walks Completed"
            value="3,456"
            change="+15.3%"
            trend="up"
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
          />
          <MetricCard
            title="Registered Pets"
            value="1,542"
            change="+5.7%"
            trend="up"
            icon={<Dog className="w-6 h-6" />}
            color="pink"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Overview (Last 7 Days)</h3>
            <div className="h-80 flex items-end justify-between gap-3">
              {[
                { day: 'Mon', amount: 45000, height: 65 },
                { day: 'Tue', amount: 32000, height: 45 },
                { day: 'Wed', amount: 58000, height: 78 },
                { day: 'Thu', amount: 38000, height: 52 },
                { day: 'Fri', amount: 67000, height: 88 },
                { day: 'Sat', amount: 52000, height: 72 },
                { day: 'Sun', amount: 72000, height: 95 },
              ].map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-3">
                  <div className="relative w-full group">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                      style={{ height: `${item.height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        KES {item.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">User Growth (Last 7 Days)</h3>
            <div className="h-80 flex items-end justify-between gap-3">
              {[
                { day: 'Mon', owners: 40, walkers: 25 },
                { day: 'Tue', owners: 55, walkers: 30 },
                { day: 'Wed', owners: 48, walkers: 35 },
                { day: 'Thu', owners: 68, walkers: 42 },
                { day: 'Fri', owners: 75, walkers: 48 },
                { day: 'Sat', owners: 82, walkers: 52 },
                { day: 'Sun', owners: 90, walkers: 58 },
              ].map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-full flex flex-col gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg"
                      style={{ height: `${item.owners}px` }}
                    ></div>
                    <div
                      className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg"
                      style={{ height: `${item.walkers}px` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Pet Owners</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Pet Walkers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Walkers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Walkers (This Month)</h3>
            <div className="space-y-4">
              <TopPerformer name="Sarah Johnson" value="127 walks" rating="4.9" rank={1} />
              <TopPerformer name="Mike Davis" value="98 walks" rating="4.8" rank={2} />
              <TopPerformer name="Emma Wilson" value="85 walks" rating="4.9" rank={3} />
              <TopPerformer name="James Brown" value="72 walks" rating="4.7" rank={4} />
            </div>
          </div>

          {/* Popular Locations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Locations</h3>
            <div className="space-y-4">
              <LocationStat location="Westlands, Nairobi" walks="456" percentage={85} />
              <LocationStat location="Kilimani, Nairobi" walks="342" percentage={65} />
              <LocationStat location="Karen, Nairobi" walks="298" percentage={55} />
              <LocationStat location="Lavington, Nairobi" walks="234" percentage={45} />
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
            <div className="space-y-4">
              <RevenueStat category="Walk Fees" amount="KES 1.8M" percentage={75} color="indigo" />
              <RevenueStat category="Premium Features" amount="KES 400K" percentage={17} color="purple" />
              <RevenueStat category="Subscriptions" amount="KES 200K" percentage={8} color="teal" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: string
  icon: React.ReactNode
  color: string
}

function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-green-600">{change}</span>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface TopPerformerProps {
  name: string
  value: string
  rating: string
  rank: number
}

function TopPerformer({ name, value, rating, rank }: TopPerformerProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
        {rank}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{value}</p>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-yellow-500">★</span>
        <span className="text-sm font-semibold text-gray-900">{rating}</span>
      </div>
    </div>
  )
}

interface LocationStatProps {
  location: string
  walks: string
  percentage: number
}

function LocationStat({ location, walks, percentage }: LocationStatProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">{location}</span>
        <span className="text-sm text-gray-600">{walks} walks</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

interface RevenueStatProps {
  category: string
  amount: string
  percentage: number
  color: string
}

function RevenueStat({ category, amount, percentage, color }: RevenueStatProps) {
  const colorClasses = {
    indigo: 'bg-indigo-600',
    purple: 'bg-purple-600',
    teal: 'bg-teal-600',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">{category}</span>
        <span className="text-sm font-semibold text-gray-900">{amount}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${colorClasses[color as keyof typeof colorClasses]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

import AdminLayout from '../layouts/AdminLayout'
import { Users, TrendingUp, DollarSign, AlertCircle, ArrowUp, ArrowDown, Dog, CreditCard } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value="1,234"
            change="+12%"
            isPositive={true}
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Active Walks"
            value="45"
            change="Live"
            isPositive={true}
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Revenue Today"
            value="KES 234,500"
            change="+8%"
            isPositive={true}
            icon={<DollarSign className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            title="Pending Issues"
            value="3"
            change="-2 from yesterday"
            isPositive={true}
            icon={<AlertCircle className="w-6 h-6" />}
            color="red"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MiniStatCard
            title="Pet Owners"
            value="856"
            icon={<Users className="w-5 h-5" />}
            color="indigo"
          />
          <MiniStatCard
            title="Pet Walkers"
            value="378"
            icon={<Users className="w-5 h-5" />}
            color="teal"
          />
          <MiniStatCard
            title="Registered Pets"
            value="1,542"
            icon={<Dog className="w-5 h-5" />}
            color="pink"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              <ActivityItem
                type="User Registration"
                description="John Doe registered as Pet Owner"
                time="2 minutes ago"
                icon="user"
              />
              <ActivityItem
                type="Walk Completed"
                description="Walk #1234 completed successfully by Sarah Walker"
                time="5 minutes ago"
                icon="walk"
              />
              <ActivityItem
                type="Payment Received"
                description="KES 5,000 payment from Jane Smith"
                time="10 minutes ago"
                icon="payment"
              />
              <ActivityItem
                type="New Pet Added"
                description="Max (Golden Retriever) added by Mike Johnson"
                time="15 minutes ago"
                icon="pet"
              />
              <ActivityItem
                type="Walker Verified"
                description="Emma Wilson completed verification process"
                time="1 hour ago"
                icon="verify"
              />
              <ActivityItem
                type="Complaint Resolved"
                description="Complaint #456 marked as resolved"
                time="2 hours ago"
                icon="complaint"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* Today's Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
              <div className="space-y-4">
                <SummaryItem label="Walks Completed" value="127" />
                <SummaryItem label="New Registrations" value="23" />
                <SummaryItem label="Total Earnings" value="KES 234,500" />
                <SummaryItem label="Active Users" value="456" />
              </div>
            </div>

            {/* Top Walkers */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Walkers</h3>
              <div className="space-y-3">
                <TopWalkerItem name="Sarah Johnson" walks="45" rating="4.9" />
                <TopWalkerItem name="Mike Davis" walks="38" rating="4.8" />
                <TopWalkerItem name="Emma Wilson" walks="32" rating="4.9" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {[65, 45, 78, 52, 88, 72, 95].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User Growth */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {[40, 55, 48, 68, 75, 82, 90].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg"
                      style={{ height: `${height * 0.6}px` }}
                    ></div>
                    <div
                      className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg"
                      style={{ height: `${height * 0.4}px` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Owners</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Walkers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

interface StatCardProps {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'red'
}

function StatCard({ title, value, change, isPositive, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`${colorClasses[color]} p-3 rounded-lg text-white`}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-green-600">
          {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          <span>{change}</span>
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface MiniStatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color: string
}

function MiniStatCard({ title, value, icon, color }: MiniStatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
      <div className={`bg-${color}-100 p-3 rounded-lg text-${color}-600`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

interface ActivityItemProps {
  type: string
  description: string
  time: string
  icon: string
}

function ActivityItem({ type, description, time, icon }: ActivityItemProps) {
  const iconColors = {
    user: 'bg-blue-100 text-blue-600',
    walk: 'bg-green-100 text-green-600',
    payment: 'bg-purple-100 text-purple-600',
    pet: 'bg-pink-100 text-pink-600',
    verify: 'bg-teal-100 text-teal-600',
    complaint: 'bg-red-100 text-red-600',
  }

  return (
    <div className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColors[icon as keyof typeof iconColors]}`}>
        {icon === 'user' && <Users className="w-5 h-5" />}
        {icon === 'walk' && <TrendingUp className="w-5 h-5" />}
        {icon === 'payment' && <CreditCard className="w-5 h-5" />}
        {icon === 'pet' && <Dog className="w-5 h-5" />}
        {icon === 'verify' && <AlertCircle className="w-5 h-5" />}
        {icon === 'complaint' && <AlertCircle className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm">{type}</p>
        <p className="text-sm text-gray-600 truncate">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  )
}

interface SummaryItemProps {
  label: string
  value: string
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  )
}

interface TopWalkerItemProps {
  name: string
  walks: string
  rating: string
}

function TopWalkerItem({ name, walks, rating }: TopWalkerItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{walks} walks</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-yellow-500">★</span>
        <span className="text-sm font-semibold text-gray-900">{rating}</span>
      </div>
    </div>
  )
}

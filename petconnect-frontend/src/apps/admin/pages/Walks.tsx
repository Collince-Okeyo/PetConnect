import AdminLayout from '../layouts/AdminLayout'
import { Search, MapPin, Clock, DollarSign, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { useState } from 'react'

export default function Walks() {
  const [filter, setFilter] = useState('all')

  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Walk Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all walks</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Walks" value="3,456" color="blue" />
          <StatCard title="Active Now" value="45" color="green" />
          <StatCard title="Completed Today" value="127" color="purple" />
          <StatCard title="Cancelled" value="23" color="red" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by pet name, owner, or walker..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'active' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'cancelled' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        {/* Walks Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Walk ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet & Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Walker</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <WalkRow
                  walkId="#W1234"
                  petName="Max"
                  ownerName="John Doe"
                  walkerName="Sarah Johnson"
                  date="Today"
                  time="3:00 PM"
                  duration="30 mins"
                  amount="KES 500"
                  status="active"
                />
                <WalkRow
                  walkId="#W1233"
                  petName="Bella"
                  ownerName="Emma Wilson"
                  walkerName="Mike Davis"
                  date="Today"
                  time="2:30 PM"
                  duration="45 mins"
                  amount="KES 750"
                  status="completed"
                />
                <WalkRow
                  walkId="#W1232"
                  petName="Charlie"
                  ownerName="James Brown"
                  walkerName="Sarah Johnson"
                  date="Today"
                  time="1:00 PM"
                  duration="30 mins"
                  amount="KES 500"
                  status="completed"
                />
                <WalkRow
                  walkId="#W1231"
                  petName="Luna"
                  ownerName="Mike Johnson"
                  walkerName="Emma Davis"
                  date="Today"
                  time="12:00 PM"
                  duration="60 mins"
                  amount="KES 1,000"
                  status="cancelled"
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">1-10</span> of <span className="font-medium">3,456</span>
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

interface StatCardProps {
  title: string
  value: string
  color: string
}

function StatCard({ title, value, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface WalkRowProps {
  walkId: string
  petName: string
  ownerName: string
  walkerName: string
  date: string
  time: string
  duration: string
  amount: string
  status: string
}

function WalkRow({ walkId, petName, ownerName, walkerName, date, time, duration, amount, status }: WalkRowProps) {
  const statusConfig = {
    active: { color: 'bg-green-100 text-green-600', icon: <MapPin className="w-3 h-3" /> },
    completed: { color: 'bg-blue-100 text-blue-600', icon: <CheckCircle className="w-3 h-3" /> },
    cancelled: { color: 'bg-red-100 text-red-600', icon: <XCircle className="w-3 h-3" /> },
  }

  const config = statusConfig[status as keyof typeof statusConfig]

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-gray-900">{walkId}</span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{petName}</div>
        <div className="text-sm text-gray-500">{ownerName}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{walkerName}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{date}</div>
        <div className="text-sm text-gray-500">{time}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900 flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-400" />
          {duration}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-gray-400" />
          {amount}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${config.color}`}>
          {config.icon}
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">View Details</button>
      </td>
    </tr>
  )
}

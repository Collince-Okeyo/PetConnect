import AdminLayout from '../layouts/AdminLayout'
import { Search, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useState } from 'react'

export default function Complaints() {
  const [filter, setFilter] = useState('all')

  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complaints & Disputes</h1>
          <p className="text-gray-600 mt-1">Handle user complaints and resolve disputes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Complaints" value="156" color="red" />
          <StatCard title="Open" value="23" color="yellow" />
          <StatCard title="In Progress" value="45" color="blue" />
          <StatCard title="Resolved" value="88" color="green" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('open')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'open' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
              >
                Open
              </button>
              <button
                onClick={() => setFilter('progress')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'progress' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter('resolved')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'resolved' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
              >
                Resolved
              </button>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          <ComplaintCard
            id="#C123"
            title="Walker didn't show up"
            description="The walker didn't arrive at the scheduled time and didn't communicate."
            complainant="John Doe"
            against="Sarah Johnson"
            category="No Show"
            priority="high"
            status="open"
            date="Dec 19, 2024"
          />
          <ComplaintCard
            id="#C122"
            title="Payment issue"
            description="Payment was deducted but walk was cancelled."
            complainant="Emma Wilson"
            against="System"
            category="Payment"
            priority="medium"
            status="progress"
            date="Dec 18, 2024"
          />
          <ComplaintCard
            id="#C121"
            title="Pet returned injured"
            description="My pet had a minor injury after the walk."
            complainant="Mike Davis"
            against="James Walker"
            category="Safety"
            priority="high"
            status="progress"
            date="Dec 17, 2024"
          />
          <ComplaintCard
            id="#C120"
            title="Late arrival"
            description="Walker was 30 minutes late without notice."
            complainant="Lisa Anderson"
            against="Tom Wilson"
            category="Punctuality"
            priority="low"
            status="resolved"
            date="Dec 16, 2024"
          />
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between">
          <p className="text-sm text-gray-600">Showing 1-10 of 156</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded-lg">Previous</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border rounded-lg">Next</button>
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

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-gray-600 text-sm mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface ComplaintCardProps {
  id: string
  title: string
  description: string
  complainant: string
  against: string
  category: string
  priority: string
  status: string
  date: string
}

function ComplaintCard({ id, title, description, complainant, against, category, priority, status, date }: ComplaintCardProps) {
  const statusConfig = {
    open: { color: 'bg-red-100 text-red-600', icon: <AlertCircle className="w-4 h-4" /> },
    progress: { color: 'bg-blue-100 text-blue-600', icon: <Clock className="w-4 h-4" /> },
    resolved: { color: 'bg-green-100 text-green-600', icon: <CheckCircle className="w-4 h-4" /> },
    closed: { color: 'bg-gray-100 text-gray-600', icon: <XCircle className="w-4 h-4" /> },
  }

  const priorityColors = {
    high: 'bg-red-100 text-red-600',
    medium: 'bg-yellow-100 text-yellow-600',
    low: 'bg-blue-100 text-blue-600',
  }

  const config = statusConfig[status as keyof typeof statusConfig]

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-500">{id}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority as keyof typeof priorityColors]}`}>
              {priority} priority
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              {category}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-3">{description}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">
              <span className="font-medium">From:</span> {complainant}
            </span>
            <span className="text-gray-500">
              <span className="font-medium">Against:</span> {against}
            </span>
            <span className="text-gray-500">{date}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
            {config.icon}
            {status}
          </span>
          <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

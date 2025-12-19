import AdminLayout from '../layouts/AdminLayout'
import { Search, Filter, UserPlus, MoreVertical, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useState } from 'react'

export default function Users() {
  const [filter, setFilter] = useState('all')

  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage pet owners and walkers</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value="1,234" color="blue" />
          <StatCard title="Pet Owners" value="856" color="purple" />
          <StatCard title="Pet Walkers" value="378" color="teal" />
          <StatCard title="Pending Verification" value="12" color="yellow" />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('owners')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'owners'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Owners
              </button>
              <button
                onClick={() => setFilter('walkers')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'walkers'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Walkers
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <UserRow
                  name="John Doe"
                  email="john@example.com"
                  phone="+254712345678"
                  role="owner"
                  status="verified"
                  joinedDate="Dec 15, 2024"
                />
                <UserRow
                  name="Sarah Johnson"
                  email="sarah@example.com"
                  phone="+254723456789"
                  role="walker"
                  status="verified"
                  joinedDate="Dec 14, 2024"
                />
                <UserRow
                  name="Mike Davis"
                  email="mike@example.com"
                  phone="+254734567890"
                  role="walker"
                  status="pending"
                  joinedDate="Dec 18, 2024"
                />
                <UserRow
                  name="Emma Wilson"
                  email="emma@example.com"
                  phone="+254745678901"
                  role="owner"
                  status="verified"
                  joinedDate="Dec 12, 2024"
                />
                <UserRow
                  name="James Brown"
                  email="james@example.com"
                  phone="+254756789012"
                  role="walker"
                  status="suspended"
                  joinedDate="Dec 10, 2024"
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
            <span className="font-medium">1,234</span> results
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all">
              Previous
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all">
              Next
            </button>
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
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    teal: 'bg-teal-100 text-teal-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface UserRowProps {
  name: string
  email: string
  phone: string
  role: string
  status: string
  joinedDate: string
}

function UserRow({ name, email, phone, role, status, joinedDate }: UserRowProps) {
  const statusColors = {
    verified: 'bg-green-100 text-green-600',
    pending: 'bg-yellow-100 text-yellow-600',
    suspended: 'bg-red-100 text-red-600',
  }

  const roleColors = {
    owner: 'bg-purple-100 text-purple-600',
    walker: 'bg-teal-100 text-teal-600',
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {name.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[role as keyof typeof roleColors]}`}>
          {role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{email}</div>
        <div className="text-sm text-gray-500">{phone}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${statusColors[status as keyof typeof statusColors]}`}>
          {status === 'verified' && <CheckCircle className="w-3 h-3" />}
          {status === 'pending' && <Clock className="w-3 h-3" />}
          {status === 'suspended' && <XCircle className="w-3 h-3" />}
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {joinedDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
        <button className="text-gray-600 hover:text-gray-900">
          <MoreVertical className="w-5 h-5" />
        </button>
      </td>
    </tr>
  )
}

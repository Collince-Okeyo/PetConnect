import AdminLayout from '../layouts/AdminLayout'
import { Search, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useState } from 'react'

export default function Payments() {
  const [filter, setFilter] = useState('all')

  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all transactions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Revenue" value="KES 2.4M" color="green" />
          <StatCard title="Today's Revenue" value="KES 234K" color="blue" />
          <StatCard title="Pending" value="KES 45K" color="yellow" />
          <StatCard title="Refunded" value="KES 12K" color="red" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by transaction ID, user, or amount..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
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
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
              >
                Pending
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Walk ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <PaymentRow
                txId="#TX12345"
                user="John Doe"
                walkId="#W1234"
                amount="KES 500"
                method="M-Pesa"
                status="completed"
                date="Dec 19, 2024"
              />
              <PaymentRow
                txId="#TX12344"
                user="Emma Wilson"
                walkId="#W1233"
                amount="KES 750"
                method="M-Pesa"
                status="completed"
                date="Dec 19, 2024"
              />
              <PaymentRow
                txId="#TX12343"
                user="Mike Davis"
                walkId="#W1232"
                amount="KES 1,000"
                method="Card"
                status="pending"
                date="Dec 19, 2024"
              />
              <PaymentRow
                txId="#TX12342"
                user="Sarah Johnson"
                walkId="#W1231"
                amount="KES 500"
                method="M-Pesa"
                status="failed"
                date="Dec 18, 2024"
              />
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between">
          <p className="text-sm text-gray-600">Showing 1-10 of 3,456</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Previous</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Next</button>
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

interface PaymentRowProps {
  txId: string
  user: string
  walkId: string
  amount: string
  method: string
  status: string
  date: string
}

function PaymentRow({ txId, user, walkId, amount, method, status, date }: PaymentRowProps) {
  const statusConfig = {
    completed: { color: 'bg-green-100 text-green-600', icon: <CheckCircle className="w-3 h-3" /> },
    pending: { color: 'bg-yellow-100 text-yellow-600', icon: <Clock className="w-3 h-3" /> },
    failed: { color: 'bg-red-100 text-red-600', icon: <XCircle className="w-3 h-3" /> },
  }

  const config = statusConfig[status as keyof typeof statusConfig]

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{txId}</td>
      <td className="px-6 py-4 text-sm text-gray-900">{user}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{walkId}</td>
      <td className="px-6 py-4">
        <span className="text-sm font-semibold text-gray-900 flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-gray-400" />
          {amount}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{method}</td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${config.color}`}>
          {config.icon}
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{date}</td>
      <td className="px-6 py-4 text-right">
        <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">View</button>
      </td>
    </tr>
  )
}

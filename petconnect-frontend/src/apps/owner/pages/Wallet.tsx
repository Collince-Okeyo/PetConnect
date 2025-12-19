import OwnerLayout from '../layouts/OwnerLayout'
import { Plus, ArrowUpRight, ArrowDownLeft, CreditCard } from 'lucide-react'

export default function Wallet() {
  return (
    <OwnerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-gray-600 mt-1">Manage your balance and transactions</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg p-8 text-white mb-8">
          <p className="text-purple-100 mb-2">Available Balance</p>
          <h2 className="text-5xl font-bold mb-6">KES 5,000</h2>
          <div className="flex gap-4">
            <button className="flex-1 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Top Up
            </button>
            <button className="flex-1 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-all flex items-center justify-center gap-2">
              <ArrowUpRight className="w-5 h-5" />
              Withdraw
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Spent" value="KES 12,500" />
          <StatCard title="This Month" value="KES 3,200" />
          <StatCard title="Pending" value="KES 500" />
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            <TransactionItem
              type="debit"
              description="Walk payment - Max"
              walker="Sarah Johnson"
              amount="KES 500"
              date="Dec 19, 2024"
              time="3:30 PM"
            />
            <TransactionItem
              type="credit"
              description="Wallet top-up"
              walker="M-Pesa"
              amount="KES 2,000"
              date="Dec 18, 2024"
              time="10:00 AM"
            />
            <TransactionItem
              type="debit"
              description="Walk payment - Bella"
              walker="Mike Davis"
              amount="KES 750"
              date="Dec 17, 2024"
              time="5:00 PM"
            />
            <TransactionItem
              type="debit"
              description="Walk payment - Charlie"
              walker="Emma Wilson"
              amount="KES 500"
              date="Dec 16, 2024"
              time="9:00 AM"
            />
          </div>
        </div>
      </div>
    </OwnerLayout>
  )
}

interface StatCardProps {
  title: string
  value: string
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface TransactionItemProps {
  type: 'credit' | 'debit'
  description: string
  walker: string
  amount: string
  date: string
  time: string
}

function TransactionItem({ type, description, walker, amount, date, time }: TransactionItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          type === 'credit' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {type === 'credit' ? (
            <ArrowDownLeft className="w-6 h-6 text-green-600" />
          ) : (
            <ArrowUpRight className="w-6 h-6 text-red-600" />
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{description}</p>
          <p className="text-sm text-gray-500">{walker}</p>
          <p className="text-xs text-gray-400">{date} • {time}</p>
        </div>
      </div>
      <p className={`text-lg font-bold ${type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
        {type === 'credit' ? '+' : '-'}{amount}
      </p>
    </div>
  )
}

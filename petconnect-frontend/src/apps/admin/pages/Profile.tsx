import AdminLayout from '../layouts/AdminLayout'
import { Mail, Phone, Shield, Edit } from 'lucide-react'

export default function Profile() {
  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-gray-600 mt-1">Manage your administrator account</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-5xl font-bold mx-auto mb-4">
                  A
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Admin User</h2>
                <p className="text-gray-600 mb-2">System Administrator</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-600">Full Access</span>
                </div>
                <button className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">admin@petconnect.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">+254 700 000 000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Total Users" value="1,234" />
              <StatCard title="Total Walks" value="3,456" />
              <StatCard title="Revenue" value="KES 2.4M" />
              <StatCard title="Active Today" value="456" />
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <InfoItem label="Username" value="admin" />
                <InfoItem label="Email" value="admin@petconnect.com" />
                <InfoItem label="Role" value="System Administrator" />
                <InfoItem label="Account Created" value="Jan 1, 2023" />
                <InfoItem label="Last Login" value="Dec 19, 2024 - 2:30 PM" />
                <InfoItem label="Two-Factor Auth" value="Enabled" status="success" />
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'User Management',
                  'Pet Management',
                  'Walk Management',
                  'Payment Management',
                  'Analytics Access',
                  'Settings Control',
                  'Complaint Resolution',
                  'System Configuration',
                ].map((permission) => (
                  <div key={permission} className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">{permission}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Actions</h3>
              <div className="space-y-3">
                <ActionItem action="Updated platform settings" time="2 hours ago" />
                <ActionItem action="Resolved complaint #C123" time="5 hours ago" />
                <ActionItem action="Approved new walker" time="1 day ago" />
                <ActionItem action="Generated monthly report" time="2 days ago" />
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
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-gray-600 text-xs font-medium mb-1">{title}</h3>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

interface InfoItemProps {
  label: string
  value: string
  status?: string
}

function InfoItem({ label, value, status }: InfoItemProps) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-medium ${status === 'success' ? 'text-green-600' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  )
}

interface ActionItemProps {
  action: string
  time: string
}

function ActionItem({ action, time }: ActionItemProps) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{action}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  )
}

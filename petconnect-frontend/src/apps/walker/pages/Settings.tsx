import WalkerLayout from '../layouts/WalkerLayout'
import { Save, Bell, Lock, User } from 'lucide-react'

export default function Settings() {
  return (
    <WalkerLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <SettingsSection title="Profile Information" icon={<User className="w-5 h-5" />}>
            <SettingItem label="Full Name" value="Sarah Johnson" type="text" />
            <SettingItem label="Email" value="sarah@example.com" type="email" />
            <SettingItem label="Phone" value="+254 723 456 789" type="tel" />
            <SettingItem label="Location" value="Westlands, Nairobi" type="text" />
            <SettingItem label="Experience (years)" value="3" type="number" />
          </SettingsSection>

          {/* Availability */}
          <SettingsSection title="Availability" icon={<Bell className="w-5 h-5" />}>
            <ToggleSetting label="Available for Walks" description="Accept new walk requests" enabled={true} />
            <ToggleSetting label="Weekend Availability" description="Available on weekends" enabled={true} />
            <ToggleSetting label="Evening Walks" description="Accept walks after 6 PM" enabled={false} />
          </SettingsSection>

          {/* Notification Settings */}
          <SettingsSection title="Notifications" icon={<Bell className="w-5 h-5" />}>
            <ToggleSetting label="New Request Alerts" description="Get notified of new walk requests" enabled={true} />
            <ToggleSetting label="SMS Notifications" description="Receive SMS for important updates" enabled={true} />
            <ToggleSetting label="Email Notifications" description="Receive email updates" enabled={false} />
          </SettingsSection>

          {/* Security Settings */}
          <SettingsSection title="Security" icon={<Lock className="w-5 h-5" />}>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                <p className="font-medium text-gray-900">Change Password</p>
                <p className="text-sm text-gray-500">Update your password</p>
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </button>
            </div>
          </SettingsSection>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2">
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </WalkerLayout>
  )
}

interface SettingsSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

function SettingsSection({ title, icon, children }: SettingsSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

interface SettingItemProps {
  label: string
  value: string
  type: string
}

function SettingItem({ label, value, type }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        defaultValue={value}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none w-64"
      />
    </div>
  )
}

interface ToggleSettingProps {
  label: string
  description: string
  enabled: boolean
}

function ToggleSetting({ label, description, enabled }: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-teal-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

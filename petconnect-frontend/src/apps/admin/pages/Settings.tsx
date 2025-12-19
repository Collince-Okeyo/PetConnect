import AdminLayout from '../layouts/AdminLayout'
import { Save, Bell, Mail, Shield, DollarSign, Globe } from 'lucide-react'

export default function Settings() {
  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure platform settings and preferences</p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <SettingsSection
            title="General Settings"
            description="Basic platform configuration"
            icon={<Globe className="w-5 h-5" />}
          >
            <SettingItem label="Platform Name" value="PetConnect" type="text" />
            <SettingItem label="Support Email" value="support@petconnect.com" type="email" />
            <SettingItem label="Support Phone" value="+254 700 000 000" type="tel" />
            <SettingItem label="Platform Status" value="Active" type="select" options={['Active', 'Maintenance']} />
          </SettingsSection>

          {/* Pricing Settings */}
          <SettingsSection
            title="Pricing & Commission"
            description="Configure pricing and commission rates"
            icon={<DollarSign className="w-5 h-5" />}
          >
            <SettingItem label="Platform Commission (%)" value="15" type="number" />
            <SettingItem label="Minimum Walk Price (KES)" value="300" type="number" />
            <SettingItem label="Maximum Walk Price (KES)" value="5000" type="number" />
            <SettingItem label="Cancellation Fee (KES)" value="100" type="number" />
          </SettingsSection>

          {/* Notification Settings */}
          <SettingsSection
            title="Notifications"
            description="Configure notification preferences"
            icon={<Bell className="w-5 h-5" />}
          >
            <ToggleSetting label="Email Notifications" description="Send email notifications to users" enabled={true} />
            <ToggleSetting label="SMS Notifications" description="Send SMS notifications for important events" enabled={true} />
            <ToggleSetting label="Push Notifications" description="Send push notifications to mobile apps" enabled={false} />
          </SettingsSection>

          {/* Email Settings */}
          <SettingsSection
            title="Email Configuration"
            description="SMTP and email settings"
            icon={<Mail className="w-5 h-5" />}
          >
            <SettingItem label="SMTP Host" value="smtp.resend.com" type="text" />
            <SettingItem label="SMTP Port" value="587" type="number" />
            <SettingItem label="From Email" value="noreply@petconnect.com" type="email" />
            <SettingItem label="From Name" value="PetConnect" type="text" />
          </SettingsSection>

          {/* Security Settings */}
          <SettingsSection
            title="Security"
            description="Security and authentication settings"
            icon={<Shield className="w-5 h-5" />}
          >
            <ToggleSetting label="Two-Factor Authentication" description="Require 2FA for admin accounts" enabled={true} />
            <ToggleSetting label="Email Verification" description="Require email verification for new users" enabled={true} />
            <ToggleSetting label="Phone Verification" description="Require phone verification for walkers" enabled={true} />
            <SettingItem label="Session Timeout (minutes)" value="60" type="number" />
          </SettingsSection>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center gap-2">
              <Save className="w-5 h-5" />
              Save All Changes
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

interface SettingsSectionProps {
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
}

function SettingsSection({ title, description, icon, children }: SettingsSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
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
  options?: string[]
}

function SettingItem({ label, value, type, options }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {type === 'select' && options ? (
        <select
          defaultValue={value}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          defaultValue={value}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-64"
        />
      )}
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
          enabled ? 'bg-indigo-600' : 'bg-gray-200'
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

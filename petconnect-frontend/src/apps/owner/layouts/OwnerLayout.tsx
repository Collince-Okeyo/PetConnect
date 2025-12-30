import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import {
  LayoutDashboard,
  Dog,
  Calendar,
  MapPin,
  CreditCard,
  Star,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Menu,
  Search,
  Wallet
} from 'lucide-react'
import NotificationBell from '../../../components/NotificationBell'

interface OwnerLayoutProps {
  children: ReactNode
}

export default function OwnerLayout({ children }: OwnerLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/owner/dashboard' },
    { icon: Dog, label: 'My Pets', path: '/owner/pets' },
    { icon: Calendar, label: 'Book Walk', path: '/owner/book-walk' },
    { icon: CreditCard, label: 'My Bookings', path: '/owner/my-bookings' },
    { icon: MapPin, label: 'Active Walks', path: '/owner/active-walks' },
    { icon: User, label: 'Find Walkers', path: '/owner/walkers' },
    { icon: Wallet, label: 'Wallet', path: '/owner/wallet' },
    { icon: Star, label: 'Reviews', path: '/owner/reviews' },
    { icon: MessageSquare, label: 'Messages', path: '/owner/messages' },
    { icon: User, label: 'Profile', path: '/owner/profile' },
    { icon: Settings, label: 'Settings', path: '/owner/settings' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-purple-600 to-pink-600 text-white transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-purple-500">
          {sidebarOpen ? (
            <Link to="/owner/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Dog className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-bold text-lg">PetConnect</span>
            </Link>
          ) : (
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mx-auto">
              <Dog className="w-5 h-5 text-purple-600" />
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all ${
                  isActive
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'text-purple-100 hover:bg-purple-500'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-purple-500">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg w-full text-purple-100 hover:bg-purple-500 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search pets, walkers..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Pet Owner'}</p>
                <p className="text-xs text-gray-500">Pet Owner</p>
              </div>
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture.startsWith('http') ? user.profilePicture : `${import.meta.env.VITE_APP_URL}${user.profilePicture}`} 
                  alt={user.name || 'Pet Owner'} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'P'}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

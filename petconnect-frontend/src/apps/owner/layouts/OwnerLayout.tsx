import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
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
import VerificationBanner from '../../../components/VerificationBanner'
import { getVerificationStatus } from '../../../lib/verificationClient'

interface OwnerLayoutProps {
  children: ReactNode
}

export default function OwnerLayout({ children }: OwnerLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Check if screen is desktop size (1024px+)
    return typeof window !== 'undefined' && window.innerWidth >= 1024
  })
  const [verificationStatus, setVerificationStatus] = useState<any>(null)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    loadVerificationStatus()
  }, [])

  const loadVerificationStatus = async () => {
    try {
      const response = await getVerificationStatus()
      setVerificationStatus(response.data)
      setIsVerified(response.data.adminApproval.status === 'approved')
    } catch (error) {
      console.error('Error loading verification status:', error)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/owner/dashboard' },
    { icon: Dog, label: 'My Pets', path: '/owner/pets', requiresVerification: true },
    { icon: Calendar, label: 'Book Walk', path: '/owner/book-walk', requiresVerification: true },
    { icon: CreditCard, label: 'My Bookings', path: '/owner/my-bookings', requiresVerification: true },
    { icon: MapPin, label: 'Active Walks', path: '/owner/active-walks', requiresVerification: true },
    { icon: User, label: 'Find Walkers', path: '/owner/walkers', requiresVerification: true },
    { icon: Wallet, label: 'Wallet', path: '/owner/wallet', requiresVerification: true },
    { icon: Star, label: 'Reviews', path: '/owner/reviews' },
    { icon: MessageSquare, label: 'Messages', path: '/owner/messages' },
    { icon: User, label: 'Profile', path: '/owner/profile' },
    { icon: Settings, label: 'Settings', path: '/owner/settings' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-purple-600 to-pink-600 text-white transition-all duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'
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
            const isRestricted = item.requiresVerification && !isVerified
            
            return (
              <Link
                key={item.path}
                to={isRestricted ? '#' : item.path}
                onClick={(e) => {
                  if (isRestricted) {
                    e.preventDefault()
                    navigate('/verification')
                  }
                }}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all ${
                  isActive
                    ? 'bg-white text-purple-600 shadow-lg'
                    : isRestricted
                    ? 'text-purple-300 cursor-not-allowed opacity-60'
                    : 'text-purple-100 hover:bg-purple-500'
                }`}
                title={isRestricted ? 'Verification required' : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                {isRestricted && sidebarOpen && (
                  <span className="ml-auto text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                    🔒
                  </span>
                )}
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
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative hidden md:block">
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
              <div className="text-right hidden md:block">
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
          {/* Verification Banner */}
          {verificationStatus && verificationStatus.adminApproval.status !== 'approved' && (
            <VerificationBanner
              status={verificationStatus.adminApproval.status}
              rejectionReason={verificationStatus.adminApproval.rejectionReason}
            />
          )}
          {children}
        </main>
      </div>
    </div>
  )
}

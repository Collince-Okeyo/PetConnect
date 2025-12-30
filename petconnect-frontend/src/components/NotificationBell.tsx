import { Bell, X, Check } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { api } from '../lib/api'

interface Notification {
  _id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  data?: any
}

export default function NotificationBell() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications')
      if (response.data.success) {
        setNotifications(response.data.data.notifications)
        setUnreadCount(response.data.data.unreadCount)
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
    }
  }

  const markAsRead = async (notificationId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    try {
      // Optimistically update UI
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
      
      await api.put(`/notifications/${notificationId}/read`)
    } catch (err) {
      console.error('Error marking notification as read:', err)
      // Revert on error
      fetchNotifications()
    }
  }

  const markAllAsRead = async (e?: React.MouseEvent) => {
    e?.stopPropagation()
    try {
      setLoading(true)
      
      // Optimistically update UI
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
      
      await api.put('/notifications/read-all')
    } catch (err) {
      console.error('Error marking all as read:', err)
      // Revert on error
      fetchNotifications()
    } finally {
      setLoading(false)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await api.delete(`/notifications/${notificationId}`)
      fetchNotifications() // Refresh
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }

  const getNotificationIcon = (type: string) => {
    const iconClasses = "w-10 h-10 rounded-full flex items-center justify-center"
    
    switch (type) {
      case 'walk_request':
      case 'walk_accepted':
        return <div className={`${iconClasses} bg-green-100 text-green-600`}>🐕</div>
      case 'walk_started':
        return <div className={`${iconClasses} bg-blue-100 text-blue-600`}>🚶</div>
      case 'walk_completed':
        return <div className={`${iconClasses} bg-purple-100 text-purple-600`}>✅</div>
      case 'walk_cancelled':
        return <div className={`${iconClasses} bg-red-100 text-red-600`}>❌</div>
      default:
        return <div className={`${iconClasses} bg-gray-100 text-gray-600`}>🔔</div>
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && createPortal(
        <div 
          className="fixed w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] max-h-[600px] flex flex-col pointer-events-auto"
          style={{
            top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + 8 : 0,
            left: window.innerWidth < 640 ? '1rem' : 'auto',
            right: window.innerWidth < 640 ? '1rem' : window.innerWidth - (dropdownRef.current ? dropdownRef.current.getBoundingClientRect().right : 0)
          }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between relative z-10">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={(e) => markAllAsRead(e)}
                onMouseDown={(e) => e.stopPropagation()}
                disabled={loading}
                className="relative z-10 pointer-events-auto text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No notifications</p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {notification.title}
                          </h4>
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2 relative z-10">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <button
                              onClick={(e) => markAsRead(notification._id, e)}
                              onMouseDown={(e) => e.stopPropagation()}
                              className="relative z-10 pointer-events-auto text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button
                onClick={() => setShowDropdown(false)}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}

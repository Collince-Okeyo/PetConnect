import { X, AlertTriangle } from 'lucide-react'
import { useIdleTimer } from '../hooks/useIdleTimer'
import { useAuth } from '../context/AuthContext'

interface IdleTimerProps {
  timeout?: number // milliseconds
  warningTime?: number // milliseconds
}

export default function IdleTimer({ 
  timeout = 30 * 60 * 1000, // 30 minutes default
  warningTime = 2 * 60 * 1000 // 2 minutes default
}: IdleTimerProps) {
  const { logout } = useAuth()

  const {
    showWarning,
    remainingTime,
    resetTimer
  } = useIdleTimer({
    timeout,
    warningTime,
    onIdle: () => {
      // Auto logout when idle
      logout()
    },
    onWarning: () => {
      // Warning modal will show automatically
      console.log('Idle warning triggered')
    },
    onActive: () => {
      // User became active again
      console.log('User active again')
    }
  })

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!showWarning) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Still There?</h2>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            You've been inactive for a while. For your security, you'll be automatically logged out in:
          </p>
          
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {formatTime(remainingTime)}
            </div>
            <div className="text-sm text-gray-500">
              minutes remaining
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Click "Stay Logged In" to continue your session, or you'll be logged out automatically.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => logout()}
            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            Logout Now
          </button>
          <button
            onClick={resetTimer}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface ToastProps {
  show: boolean
  type: 'success' | 'error'
  message: string
  onClose: () => void
}

export default function Toast({ show, type, message, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50'
  const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200'
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800'
  const iconColor = type === 'success' ? 'text-green-600' : 'text-red-600'

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`${bgColor} ${borderColor} ${textColor} border rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px] max-w-md`}>
        {type === 'success' ? (
          <CheckCircle className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
        ) : (
          <XCircle className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
        )}
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

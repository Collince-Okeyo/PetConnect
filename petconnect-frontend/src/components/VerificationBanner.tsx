import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, X, Clock, XCircle } from 'lucide-react'

interface VerificationBannerProps {
  status: 'pending' | 'under_review' | 'rejected'
  rejectionReason?: string
}

export default function VerificationBanner({ status, rejectionReason }: VerificationBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const navigate = useNavigate()

  if (dismissed) return null

  const getBannerConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Shield,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          textColor: 'text-yellow-800',
          title: 'Account Verification Required',
          message: 'Please complete your account verification to access all features.',
          buttonText: 'Verify Now',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
        }
      case 'under_review':
        return {
          icon: Clock,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-800',
          title: 'Verification Under Review',
          message: 'Your documents are being reviewed. This usually takes 24-48 hours.',
          buttonText: 'View Status',
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        }
      case 'rejected':
        return {
          icon: XCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          textColor: 'text-red-800',
          title: 'Verification Rejected',
          message: rejectionReason || 'Your verification was rejected. Please review and resubmit.',
          buttonText: 'Resubmit',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        }
    }
  }

  const config = getBannerConfig()
  const Icon = config.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 mb-6`}
      >
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <h3 className={`font-semibold ${config.textColor} mb-1`}>
              {config.title}
            </h3>
            <p className={`text-sm ${config.textColor}`}>
              {config.message}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/verification')}
              className={`px-4 py-2 ${config.buttonColor} text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap`}
            >
              {config.buttonText}
            </button>
            
            {status === 'under_review' && (
              <button
                onClick={() => setDismissed(true)}
                className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-blue-600" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

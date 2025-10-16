import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'

export default function AuthOptionsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-brand-night border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-soft">
        <h3 className="text-xl font-semibold mb-4">Sign up for PetConnect</h3>
        <div className="space-y-3">
          <Button className="w-full" onClick={() => navigate('/register')}>Sign up with email</Button>
          <Button className="w-full" variant="ghost">Sign up with Google</Button>
          <Button className="w-full" variant="ghost">Sign up with Facebook</Button>
        </div>
        <div className="mt-4 text-sm">
          Already have an account? <button className="underline" onClick={() => navigate('/login')}>Log in</button>
        </div>
      </div>
    </div>
  )
}



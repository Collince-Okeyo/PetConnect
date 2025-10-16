import Button from '../ui/Button'

export default function SocialButtons({ onGoogle, onFacebook, loading }: { onGoogle: () => void; onFacebook: () => void; loading?: boolean }) {
  return (
    <div>
      <div className="my-4 flex items-center gap-3">
        <div className="h-px bg-gray-200 flex-1" />
        <span className="text-xs text-gray-500">or</span>
        <div className="h-px bg-gray-200 flex-1" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button onClick={onGoogle} variant="secondary" disabled={loading} className="rounded-xl">
          <span className="mr-2 inline-flex h-5 w-5" aria-hidden>
            {/* Google logo */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.04 12.261c0-.815-.073-1.596-.209-2.344H12v4.431h6.213a5.312 5.312 0 0 1-2.305 3.484v2.893h3.727c2.178-2.006 3.405-4.963 3.405-8.464Z" fill="#4285F4"/>
              <path d="M12 24c3.24 0 5.957-1.073 7.943-2.905l-3.727-2.893c-1.037.695-2.363 1.106-4.216 1.106-3.24 0-5.985-2.187-6.966-5.13H1.195v3.022A12 12 0 0 0 12 24Z" fill="#34A853"/>
              <path d="M5.034 14.178A7.21 7.21 0 0 1 4.656 12c0-.758.131-1.491.378-2.178V6.8H1.195A12 12 0 0 0 0 12c0 1.94.463 3.768 1.195 5.2l3.839-3.022Z" fill="#FBBC05"/>
              <path d="M12 4.75c1.763 0 3.345.607 4.593 1.797L20.03 2.11C17.973.216 15.255 0 12 0 7.195 0 2.983 2.763 1.195 6.8l3.839 3.022C6.015 6.88 8.76 4.75 12 4.75Z" fill="#EA4335"/>
            </svg>
          </span>
          Continue with Google
        </Button>
        <Button onClick={onFacebook} variant="secondary" disabled={loading} className="rounded-xl">
          <span className="mr-2 inline-flex h-5 w-5" aria-hidden>
            {/* Facebook logo */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24H12.82v-9.294H9.692V11.02h3.128V8.41c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.917c-1.503 0-1.795.714-1.795 1.763v2.312h3.587l-.467 3.686h-3.12V24h6.116C23.407 24 24 23.407 24 22.675V1.325C24 .593 23.407 0 22.675 0Z" fill="#1877F2"/>
            </svg>
          </span>
          Continue with Facebook
        </Button>
      </div>
    </div>
  )
}



export default function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-white text-gray-900 transition-colors">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="order-2 md:order-1">
            <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-soft p-6 md:p-8">
              <div className="mb-6 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 ">{title}</h1>
                {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
              </div>
              {children}
            </div>
          </div>
          <div className="order-1 md:order-2 hidden md:block">
            <div className="rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-sky/10 p-10 border border-gray-100 shadow-soft">
              <div className="aspect-[4/3] rounded-xl bg-white border border-gray-100 grid place-items-center">
                <div className="text-center px-6">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-brand-primary/30 grid place-items-center">
                    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 11c0-2.5 2-6 5-6s5 3.5 5 6-2 4-5 4-5-1.5-5-4Z" stroke="#72BD92" strokeWidth="1.5"/>
                      <path d="M5 19c2-2 4-3 7-3s5 1 7 3" stroke="#72BD92" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Walks, wags and worry-free days</h2>
                  <p className="mt-2 text-sm text-gray-600">Connect caring walkers with loving owners. Nature-inspired, mobile-first experience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



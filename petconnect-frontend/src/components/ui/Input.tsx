export function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-gray-200 px-3 py-2.5 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-leaf/20 focus:border-brand-leaf ${props.className || ''}`}
    />
  )
}



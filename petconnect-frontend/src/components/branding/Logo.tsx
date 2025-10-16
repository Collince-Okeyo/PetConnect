export default function Logo() {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="h-8 w-8 rounded-lg bg-brand-primary/20 grid place-items-center border border-brand-primary/30">
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 11c0-2.5 2-6 5-6s5 3.5 5 6-2 4-5 4-5-1.5-5-4Z" stroke="#72BD92" strokeWidth="1.5"/>
          <path d="M5 19c2-2 4-3 7-3s5 1 7 3" stroke="#72BD92" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <span className="font-bold tracking-tight">PetConnect</span>
    </div>
  )
}



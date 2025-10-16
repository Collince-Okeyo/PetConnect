import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button onClick={toggle} aria-label="Toggle theme" className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white px-3 py-2 text-sm">
      {theme === 'dark' ? 'Light' : 'Dark'} mode
    </button>
  )
}



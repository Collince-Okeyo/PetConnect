import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }

export default function Button({ variant = 'primary', className = '', ...props }: Props) {
  const base = 'inline-flex justify-center items-center rounded-xl px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-leaf/20'
  const styles = {
    primary: '',
    secondary: '',
    ghost: ''
  }[variant]
  return <button {...props} className={`${base} ${styles} ${className}`} />
}



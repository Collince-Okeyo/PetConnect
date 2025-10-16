import { useState } from 'react'
import Button from '../ui/Button'

type Props = { onContinue: () => void }

const services = [
  { key: 'walking', label: 'Walking' },
  { key: 'dropin', label: 'Drop-In' },
  { key: 'sitting', label: 'Sitting' },
  { key: 'boarding', label: 'Boarding' }
]

export default function BookingCard({ onContinue }: Props) {
  const [service, setService] = useState<string>('walking')
  const [date, setDate] = useState<string>('')
  const [pets, setPets] = useState<number>(1)

  const ready = Boolean(service && date && pets > 0)

  return (
    <div className="rounded-2xl bg-[#72BD92]/25 dark:bg-white/5 border border-[#72BD92]/30 dark:border-white/10 p-4 md:p-6 shadow-soft">
      <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Ready to get started? Book your first service now!</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {services.map((s) => (
          <button key={s.key} onClick={() => setService(s.key)} className={`rounded-xl px-4 py-4 border text-left transition ${service===s.key ? 'bg-white border-brand-primary shadow-sm' : 'bg-white/70 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-white'}`}>
            <div className="font-medium">{s.label}</div>
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-col md:flex-row gap-3 items-stretch">
        <div className="flex-1 rounded-xl bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 px-3 py-2 flex items-center gap-2">
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="bg-transparent outline-none w-full" />
        </div>
        <div className="flex-1 rounded-xl bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 px-3 py-2 flex items-center gap-2">
          <select value={pets} onChange={(e)=>setPets(Number(e.target.value))} className="bg-transparent outline-none w-full">
            {[1,2,3,4].map(n => <option key={n} value={n}>{n} Dog{n>1?'s':''}</option>)}
          </select>
        </div>
        <Button onClick={onContinue} disabled={!ready} className="min-w-32">Continue</Button>
      </div>
    </div>
  )
}



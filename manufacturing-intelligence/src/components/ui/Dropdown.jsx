import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

export default function Dropdown({ label, options, value, onChange, className }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selected = options.find((o) => o.value === value) || options[0]

  return (
    <div className={clsx('relative', className)} ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-surface-border bg-white text-sm text-ink hover:bg-slate-50 transition-colors"
      >
        {label && <span className="text-ink-muted">{label}:</span>}
        <span className="font-medium">{selected?.label}</span>
        <ChevronDown size={14} className={clsx('transition-transform text-ink-muted', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1.5 w-44 rounded-lg border border-surface-border bg-white shadow-raised py-1 animate-fadeIn">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={clsx(
                'w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors',
                opt.value === value ? 'text-primary font-medium' : 'text-ink'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

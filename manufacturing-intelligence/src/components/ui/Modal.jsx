import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/40 animate-fadeIn" onClick={onClose} />
      <div className="relative bg-white rounded-card shadow-raised w-full max-w-lg animate-fadeIn">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

import { useEffect } from 'react'

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         onClick={e => e.target === e.currentTarget && onClose()}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-base/70 backdrop-blur-sm animate-fade-up" style={{animationDuration:'0.15s'}} />
      {/* Panel */}
      <div className="relative w-full max-w-md card animate-fade-up shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-700 text-lg text-slate-bright">{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-soft hover:text-slate-bright hover:bg-border transition-colors">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
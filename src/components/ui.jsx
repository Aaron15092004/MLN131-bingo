import { useEffect, useRef } from 'react'

// Disabled = dashed outline, no fill, full-contrast text (dimming with opacity would drop below 7:1).
const base =
  'inline-flex select-none items-center justify-center gap-3 rounded-2xl border-2 font-bold transition-colors duration-150 disabled:border-dashed disabled:bg-transparent disabled:text-mist disabled:hover:bg-transparent'

// Hit targets are >= 3rem (48px at 1080p); borders that carry meaning use ink-500 (>= 3:1).
export const btn = {
  ghost: `${base} min-h-14 border-ink-500 bg-ink-800 px-6 text-2xl text-paper hover:bg-ink-700 active:bg-ink-600`,
  small: `${base} min-h-12 border-ink-500 bg-transparent px-4 text-xl text-mist hover:bg-ink-700 hover:text-paper active:bg-ink-600`,
  gold: `${base} min-h-14 border-gold-300 bg-gold-400 px-8 text-2xl font-extrabold text-ink-900 hover:bg-gold-300 active:bg-gold-500`,
  danger: `${base} min-h-14 border-crimson-300 bg-crimson-700 px-8 text-2xl text-paper hover:bg-crimson-800 active:bg-crimson-800`,
}

export function Kbd({ children }) {
  return <kbd className="rounded-lg border-2 border-current px-2.5 py-1 text-base font-bold leading-none">{children}</kbd>
}

// Native <dialog>: focus trap, Esc handling and inert background come for free.
// Put data-autofocus on the element that should receive focus first.
export function Modal({ label, onClose, className = '', children }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog.open) dialog.showModal()
    dialog.querySelector('[data-autofocus]')?.focus()
    return () => {
      if (dialog.open) dialog.close()
    }
  }, [])

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      className={`m-auto max-h-[94dvh] max-w-[97vw] animate-rise overflow-auto rounded-3xl border-2 border-ink-500 bg-ink-900 p-0 shadow-[0_2rem_6rem_rgb(0_0_0/0.7)] ${className}`}
    >
      {children}
    </dialog>
  )
}

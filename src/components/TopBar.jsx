import { Maximize, Minimize, Scale } from 'lucide-react'
import { btn } from './ui.jsx'

// `center` is the big readout ("Đã khoanh: 3/25" or "Câu 7"); `children` are extra controls on the right.
export function TopBar({ title, center, isFullscreen, onFullscreen, children }) {
  const [main, sub] = title.split(/:\s*/)
  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-8 border-b-2 border-ink-600 bg-ink-950/60 px-10 py-3">
      <div className="flex min-w-0 items-center gap-4">
        <Scale aria-hidden="true" className="size-12 shrink-0 text-gold-400" strokeWidth={2.25} />
        <div className="min-w-0">
          <h1 className="truncate text-[1.75rem] font-extrabold leading-tight">{main}</h1>
          {sub && <p className="truncate text-xl font-bold leading-tight text-gold-400">{sub}</p>}
        </div>
      </div>

      <p className="whitespace-nowrap text-counter font-extrabold tabular-nums">{center}</p>

      <nav aria-label="Điều khiển" className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onFullscreen}
          aria-label={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          title={`${isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'} (F)`}
          aria-keyshortcuts="F"
          className={`${btn.small} px-3`}
        >
          {isFullscreen ? <Minimize aria-hidden="true" className="size-6" /> : <Maximize aria-hidden="true" className="size-6" />}
        </button>
        {children}
      </nav>
    </header>
  )
}

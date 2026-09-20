import { Kbd } from './ui.jsx'

const COLUMNS = 5

const noticeTone = {
  ok: 'text-gold-300',
  info: 'text-mist',
  error: 'text-crimson-300',
}

function Cell({ n, isMarked, isTyped, onOpen }) {
  // Open = bright gold coin. Circled = dark, crossed out, and disabled (cannot be reopened).
  const tone = isMarked
    ? 'border-ink-600 bg-ink-900 text-mist'
    : 'border-gold-300 bg-gold-400 text-ink-900 shadow-[0_0.5rem_1.5rem_rgb(246_201_69/0.18)] hover:bg-gold-300 active:bg-gold-500'
  return (
    <button
      type="button"
      disabled={isMarked}
      onClick={() => onOpen(n)}
      aria-label={isMarked ? `Câu ${n}, đã khoanh` : `Mở câu ${n}`}
      className={`${tone} ${isTyped ? 'ring-[6px] ring-paper ring-offset-4 ring-offset-ink-900' : ''} relative grid size-full place-items-center rounded-3xl border-[3px] text-[6.5rem] font-extrabold leading-none tabular-nums transition-colors duration-150`}
    >
      {n}
      {isMarked && (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full p-3">
          <g className="stroke-crimson-300" strokeWidth="7" strokeLinecap="round" vectorEffect="non-scaling-stroke">
            <line x1="4" y1="6" x2="96" y2="94" vectorEffect="non-scaling-stroke" />
            <line x1="96" y1="6" x2="4" y2="94" vectorEffect="non-scaling-stroke" />
          </g>
        </svg>
      )}
    </button>
  )
}

// The main screen: numbered cells in fixed order. Pick one by clicking it, or typing its number + Enter.
export function Board({ ids, marked, typed, notice, onOpen }) {
  const typedN = typed ? parseInt(typed, 10) : null
  const rows = Math.ceil(ids.length / COLUMNS)
  const allDone = ids.every((n) => marked.has(n))

  return (
    <div className="flex min-h-0 flex-1 animate-rise flex-col gap-4">
      <div className="flex min-h-[4.5rem] items-center gap-6">
        <p className="text-2xl font-bold text-mist">
          Gõ số rồi nhấn <Kbd>Enter</Kbd> hoặc bấm vào ô để mở câu hỏi.
        </p>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-mist">Đang gõ</span>
          <output
            aria-label="Số đang gõ"
            className={`grid h-16 min-w-28 place-items-center rounded-2xl border-4 bg-ink-950 px-5 text-[2.75rem] font-extrabold tabular-nums ${typed ? 'border-gold-400 text-gold-300' : 'border-ink-500 text-mist'}`}
          >
            {typed || '–'}
          </output>
        </div>
        <p role="status" className={`ml-auto text-2xl font-bold ${notice ? noticeTone[notice.tone] : 'text-mist'}`}>
          {notice ? notice.text : allDone ? 'Đã khoanh hết tất cả các số.' : ''}
        </p>
      </div>

      <ol
        aria-label="Bảng số"
        className="m-0 grid min-h-0 flex-1 list-none grid-cols-5 gap-4 p-0"
        style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
      >
        {ids.map((n) => (
          <li key={n} className="min-h-0 min-w-0">
            <Cell n={n} isMarked={marked.has(n)} isTyped={n === typedN} onOpen={onOpen} />
          </li>
        ))}
      </ol>
    </div>
  )
}

import { Check, X } from 'lucide-react'

const LETTERS = 'ABCDEFGH'

// One size per question (set by its longest option): short options are shown much larger.
const textSize = (options) => {
  const longest = Math.max(...options.map((o) => o.length))
  return longest <= 16 ? 'text-[3.5rem]' : longest <= 26 ? 'text-[3rem]' : 'text-[2.5rem]'
}

// `answer` is null until an option is picked, then { choice, correct }.
// The right option is only ever highlighted when it was the one picked: this component is never told
// which option is right, so after a wrong pick nothing here (visual or screen-reader) points to it.
export function Options({ options, answer, onSelect }) {
  const size = textSize(options)
  const answered = answer !== null

  return (
    <ol aria-label="Các phương án" className="m-0 grid min-h-0 flex-1 list-none auto-rows-fr grid-cols-2 gap-5 p-0">
      {options.map((text, i) => {
        const isRight = answered && answer.choice === i && answer.correct
        const isWrong = answered && answer.choice === i && !answer.correct

        let tone = 'border-ink-500 bg-ink-800 text-paper'
        let badge = 'bg-ink-700 text-gold-300'
        if (!answered) tone += ' hover:border-gold-400 hover:bg-ink-700 active:bg-ink-600'
        else if (isRight) {
          tone = 'border-gold-300 bg-gold-400 text-ink-900'
          badge = 'bg-ink-900 text-gold-300'
        } else if (isWrong) {
          tone = 'border-crimson-300 bg-crimson-800 text-paper'
          badge = 'bg-paper text-crimson-800'
        } else if (answer.correct) {
          tone = 'border-ink-600 bg-ink-900 text-mist'
          badge = 'border-2 border-ink-500 text-mist'
        }

        return (
          <li key={i} className="min-h-0 min-w-0">
            <button
              type="button"
              disabled={answered}
              onClick={() => onSelect(i)}
              aria-keyshortcuts={LETTERS[i]}
              className={`${tone} flex size-full items-center gap-5 rounded-3xl border-[3px] px-6 py-3 text-left transition-colors duration-150`}
            >
              <span aria-hidden="true" className={`${badge} grid size-16 shrink-0 place-items-center rounded-2xl text-[2.5rem] font-extrabold leading-none`}>
                {LETTERS[i]}
              </span>
              <span className="sr-only">Phương án {LETTERS[i]}:</span>
              <span className={`${size} min-w-0 flex-1 text-balance font-bold leading-tight`}>{text}</span>
              {isRight && (
                <>
                  <Check aria-hidden="true" className="size-12 shrink-0" strokeWidth={3.5} />
                  <span className="sr-only">Đúng</span>
                </>
              )}
              {isWrong && (
                <>
                  <X aria-hidden="true" className="size-12 shrink-0" strokeWidth={3.5} />
                  <span className="sr-only">Chưa đúng</span>
                </>
              )}
            </button>
          </li>
        )
      })}
    </ol>
  )
}

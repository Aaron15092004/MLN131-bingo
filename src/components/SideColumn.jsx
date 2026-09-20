import { Check, LayoutGrid, Pause, Play, Plus, X } from 'lucide-react'
import { Kbd, btn } from './ui.jsx'

const RADIUS = 88
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const ALERT_SECONDS = 5

// `answer` is null while waiting, then { choice, correct }.
function TimerRing({ timer, answer }) {
  const answered = answer !== null
  const seconds = Math.ceil(timer.remaining)
  const alert = !answered && (timer.expired || seconds <= ALERT_SECONDS)
  const fraction = answered ? 0 : Math.min(1, Math.max(0, timer.remaining / timer.total))
  const stroke = alert ? 'stroke-crimson-300' : 'stroke-gold-400'
  const label = !answered ? `Còn ${seconds} giây` : answer.correct ? 'Đã trả lời đúng' : 'Đã trả lời, chưa đúng'

  return (
    <div className="flex flex-col items-center gap-3">
      <div role="timer" aria-label={label} className={`relative size-50 ${timer.expired && !answered ? 'animate-alert' : ''}`}>
        <svg viewBox="0 0 200 200" aria-hidden="true" className="size-full -rotate-90">
          <circle cx="100" cy="100" r={RADIUS} fill="none" strokeWidth="16" className="stroke-ink-700" />
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
            className={`${stroke} transition-[stroke] duration-200`}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          {answered ? (
            answer.correct ? (
              <Check aria-hidden="true" className="size-24 text-gold-400" strokeWidth={3} />
            ) : (
              <X aria-hidden="true" className="size-24 text-crimson-300" strokeWidth={3} />
            )
          ) : (
            <span className={`text-[5rem] font-extrabold tabular-nums leading-none ${alert ? 'text-crimson-300' : 'text-paper'}`}>{seconds}</span>
          )}
        </div>
      </div>
      <p className={`h-8 text-2xl font-extrabold ${answered ? (answer.correct ? 'text-gold-300' : 'text-crimson-300') : alert ? 'text-crimson-300' : 'text-mist'}`}>
        {answered ? (answer.correct ? 'Đúng' : 'Chưa đúng') : timer.expired ? 'Hết giờ!' : timer.paused ? 'Tạm dừng' : ''}
      </p>
    </div>
  )
}

// Timer on top; the way back to the board at the bottom (gold once the question has been answered).
export function SideColumn({ timer, answer, onBack }) {
  const answered = answer !== null
  return (
    <aside aria-label="Đồng hồ và điều hướng" className="flex flex-col items-stretch gap-4">
      <TimerRing timer={timer} answer={answer} />

      <div className={`grid grid-cols-2 gap-3 ${answered ? 'invisible' : ''}`}>
        <button
          type="button"
          onClick={timer.toggle}
          disabled={timer.expired}
          aria-keyshortcuts="T"
          title="Tạm dừng / tiếp tục (T)"
          className={`${btn.small} min-h-14 gap-2 whitespace-nowrap px-2`}
        >
          {timer.paused ? <Play aria-hidden="true" className="size-6 shrink-0" /> : <Pause aria-hidden="true" className="size-6 shrink-0" />}
          {timer.paused ? 'Tiếp tục' : 'Tạm dừng'}
        </button>
        <button type="button" onClick={() => timer.addTime(10)} title="Thêm 10 giây" className={`${btn.small} min-h-14 gap-2 whitespace-nowrap px-2`}>
          <Plus aria-hidden="true" className="size-6 shrink-0" />
          10 giây
        </button>
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-keyshortcuts="Escape"
          className={`${answered ? `${btn.gold} min-h-24 text-[1.75rem]` : `${btn.small} min-h-14`} justify-between gap-3 px-5`}
        >
          <span className="flex items-center gap-3">
            <LayoutGrid aria-hidden="true" className="size-6" />
            Về bảng số
          </span>
          <Kbd>Esc</Kbd>
        </button>
      </div>
    </aside>
  )
}

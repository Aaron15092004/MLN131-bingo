import { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { useCountdown } from '../lib/useCountdown.js'
import { useGame } from '../lib/useGame.js'
import { Board } from '../components/Board.jsx'
import { ConfirmReset } from '../components/ConfirmReset.jsx'
import { QuestionView } from '../components/QuestionView.jsx'
import { TopBar } from '../components/TopBar.jsx'
import { btn } from '../components/ui.jsx'

const DIGIT = /^(?:Digit|Numpad)(\d)$/
const TYPED_IDLE_MS = 6000 // a half-typed number is dropped, so a stale digit can never open the wrong question
const NOTICE_MS = 4000

const isEditable = (el) => el instanceof HTMLElement && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))

export default function HostView({ data }) {
  const { ids, questionsById, marked, actions } = useGame(data)
  const [open, setOpen] = useState(null) // { n, seq } while a question is on screen, else null (= number board)
  const [answer, setAnswer] = useState(null) // { choice, correct } once an option was picked; the question is then locked
  const [typed, setTyped] = useState('')
  const [notice, setNotice] = useState(null) // { text, tone: 'ok' | 'info' | 'error' }
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(() => Boolean(document.fullscreenElement))
  const openCount = useRef(0)

  const question = open ? questionsById.get(open.n) : null
  const maxDigits = String(ids[ids.length - 1]).length

  const timer = useCountdown({
    seconds: data.meta.timerSeconds,
    // a new key on every open, so re-opening a kept number restarts the countdown
    resetKey: open ? `${open.n}:${open.seq}` : 'board',
    active: open !== null && answer === null,
    suspended: confirmingReset,
  })
  const { toggle: toggleTimer } = timer

  const openQuestion = useCallback((n) => {
    openCount.current += 1
    setOpen({ n, seq: openCount.current })
    setAnswer(null)
    setTyped('')
    setNotice(null)
  }, [])

  // Going back never changes anything by itself; a pick already did its work when it was made.
  const backToBoard = useCallback(() => {
    if (open && answer) {
      setNotice(answer.correct ? { text: `Đã khoanh số ${open.n}.`, tone: 'ok' } : { text: `Chưa đúng, giữ lại số ${open.n}.`, tone: 'info' })
    }
    setOpen(null)
    setAnswer(null)
  }, [open, answer])

  // Picking an option locks the question. Correct: circle the number. Wrong: keep it, and reveal nothing.
  const select = useCallback(
    (i) => {
      if (!question || answer) return
      const correct = i === question.answer.charCodeAt(0) - 65
      setAnswer({ choice: i, correct })
      if (correct) actions.mark(question.id)
    },
    [question, answer, actions],
  )

  const openCell = useCallback(
    (n) => {
      if (!marked.has(n)) openQuestion(n)
    },
    [marked, openQuestion],
  )

  const submitTyped = useCallback(() => {
    const n = parseInt(typed, 10)
    setTyped('')
    if (!questionsById.has(n)) setNotice({ text: `Không có câu ${n}. Hãy chọn số từ ${ids[0]} đến ${ids[ids.length - 1]}.`, tone: 'error' })
    else if (marked.has(n)) setNotice({ text: `Số ${n} đã khoanh, không mở lại được.`, tone: 'error' })
    else openQuestion(n)
  }, [typed, questionsById, marked, ids, openQuestion])

  const confirmReset = () => {
    actions.reset()
    setNotice({ text: 'Đã đặt lại: chưa khoanh số nào.', tone: 'info' })
    setConfirmingReset(false)
  }

  useEffect(() => {
    if (!typed) return undefined
    const id = setTimeout(() => setTyped(''), TYPED_IDLE_MS)
    return () => clearTimeout(id)
  }, [typed])

  useEffect(() => {
    if (!notice) return undefined
    const id = setTimeout(() => setNotice(null), NOTICE_MS)
    return () => clearTimeout(id)
  }, [notice])

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await document.documentElement.requestFullscreen()
        // Chromium: a short Esc press reaches the page (so Esc = "Về bảng số" still works in fullscreen);
        // hold Esc to leave fullscreen. Other browsers ignore this.
        await navigator.keyboard?.lock?.(['Escape'])
      }
    } catch {
      // fullscreen / keyboard lock unavailable: the page keeps working normally
    }
  }, [])

  useEffect(() => {
    const onChange = () => {
      const on = Boolean(document.fullscreenElement)
      setIsFullscreen(on)
      if (!on) navigator.keyboard?.unlock?.()
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  // Keyboard. Uses event.code so it works regardless of layout or Vietnamese IME state.
  useEffect(() => {
    if (confirmingReset) return undefined

    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || isEditable(e.target)) return
      let run = null
      if (e.code === 'KeyF') {
        run = toggleFullscreen
      } else if (question) {
        if (e.code === 'Escape') run = backToBoard
        else if (e.code === 'KeyT') run = () => !answer && toggleTimer()
        else if (!answer && /^Key[A-Z]$/.test(e.code)) {
          const choice = e.code.charCodeAt(3) - 65 // KeyA -> 0 (A) ... KeyD -> 3 (D)
          if (choice < question.options.length) run = () => select(choice)
        }
      } else {
        const digit = e.shiftKey ? null : DIGIT.exec(e.code)
        if (digit) run = () => setTyped((t) => (t.length >= maxDigits ? digit[1] : t + digit[1]))
        else if (typed && e.code === 'Backspace') run = () => setTyped((t) => t.slice(0, -1))
        else if (typed && e.code === 'Escape') run = () => setTyped('')
        else if (typed && (e.code === 'Enter' || e.code === 'NumpadEnter')) run = submitTyped
      }
      if (!run) return
      e.preventDefault() // also stops Enter from clicking a focused button on top of the shortcut
      if (!e.repeat) run()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [confirmingReset, question, answer, typed, maxDigits, toggleFullscreen, toggleTimer, backToBoard, select, submitTyped])

  const center = question ? (
    <>
      Câu <span className="text-gold-400">{question.id}</span>
    </>
  ) : (
    <>
      Đã khoanh: <span className="text-gold-400">{marked.size}</span>/{ids.length}
    </>
  )

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[radial-gradient(90rem_36rem_at_50%_-8rem,rgb(246_201_69/0.10),transparent_65%),linear-gradient(var(--color-ink-900),var(--color-ink-950))]">
      <TopBar title={data.meta.title} center={center} isFullscreen={isFullscreen} onFullscreen={toggleFullscreen}>
        {!question && (
          <button type="button" onClick={() => setConfirmingReset(true)} title="Đặt lại bảng số" className={btn.small}>
            <RotateCcw aria-hidden="true" className="size-6" />
            Đặt lại
          </button>
        )}
      </TopBar>

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-10 py-6">
        {question ? (
          <QuestionView key={open.seq} question={question} answer={answer} timer={timer} onSelect={select} onBack={backToBoard} />
        ) : (
          <Board ids={ids} marked={marked} typed={typed} notice={notice} onOpen={openCell} />
        )}
      </main>

      {confirmingReset && <ConfirmReset onCancel={() => setConfirmingReset(false)} onConfirm={confirmReset} />}
    </div>
  )
}

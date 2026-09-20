import { useCallback, useEffect, useState } from 'react'

const TICK_MS = 100

// Per-question countdown. It restarts whenever `resetKey` changes, only runs while `active`,
// and is frozen (not reset) while `suspended` — e.g. behind a dialog.
// Time is measured from performance.now(), so it does not drift if ticks are delayed.
export function useCountdown({ seconds, resetKey, active, suspended = false }) {
  const fresh = () => ({ total: seconds, remainingMs: seconds * 1000, paused: false, epoch: 0 })
  const [state, setState] = useState(fresh)
  const [seenKey, setSeenKey] = useState(resetKey)

  if (seenKey !== resetKey) {
    // reset during render (not in an effect) so the previous question's time never flashes
    setSeenKey(resetKey)
    setState(fresh())
  }

  const expired = state.remainingMs <= 0
  const running = active && !suspended && !state.paused && !expired

  useEffect(() => {
    if (!running) return undefined
    const startedAt = performance.now()
    const startMs = state.remainingMs
    const id = setInterval(() => {
      const left = Math.max(0, startMs - (performance.now() - startedAt))
      setState((s) => ({ ...s, remainingMs: left }))
    }, TICK_MS)
    return () => clearInterval(id)
    // state.remainingMs is read only when (re)starting; ticks must not restart the interval
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, state.epoch, resetKey])

  const toggle = useCallback(() => setState((s) => (s.remainingMs > 0 ? { ...s, paused: !s.paused } : s)), [])

  const addTime = useCallback(
    (extra = 10) =>
      setState((s) => {
        const remainingMs = s.remainingMs + extra * 1000
        return { ...s, remainingMs, total: Math.max(s.total, Math.ceil(remainingMs / 1000)), epoch: s.epoch + 1 }
      }),
    [],
  )

  return {
    total: state.total,
    remaining: state.remainingMs / 1000,
    paused: state.paused,
    running,
    expired,
    toggle,
    addTime,
  }
}

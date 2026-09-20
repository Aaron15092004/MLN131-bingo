import { useEffect, useMemo, useState } from 'react'
import { loadMarked, saveMarked, withMarked } from './game.js'

// Board state: which question numbers have been circled. Restored from localStorage on load
// and saved on every change, so refreshing the page never loses it.
export function useGame(data) {
  const ids = useMemo(() => data.questions.map((q) => q.id).sort((a, b) => a - b), [data])
  const questionsById = useMemo(() => new Map(data.questions.map((q) => [q.id, q])), [data])

  const [marked, setMarked] = useState(() => loadMarked(ids))

  useEffect(() => {
    saveMarked(marked)
  }, [marked])

  const markedSet = useMemo(() => new Set(marked), [marked])

  const actions = useMemo(
    () => ({
      mark: (n) => setMarked((m) => withMarked(m, n)),
      reset: () => setMarked([]),
    }),
    [],
  )

  return { ids, questionsById, marked: markedSet, actions }
}

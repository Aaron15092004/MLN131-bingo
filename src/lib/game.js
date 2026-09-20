// The only persisted state is the list of circled question numbers, e.g. [3, 7, 12].
export const STORAGE_KEY = 'bingo-ntpq:board:v2'

// Written by earlier versions (shuffled order / seed / index / phase, and print settings).
// They are removed on load so stale data can never be read back.
const LEGACY_KEYS = ['bingo-ntpq:game:v1', 'bingo-ntpq:print:v1']

// Sorted, de-duplicated numbers that exist in the data; anything else is dropped.
export function parseMarked(json, ids) {
  let raw
  try {
    raw = JSON.parse(json)
  } catch {
    return []
  }
  if (!Array.isArray(raw)) return []
  const known = new Set(ids)
  return [...new Set(raw)].filter((n) => known.has(n)).sort((a, b) => a - b)
}

export function loadMarked(ids) {
  try {
    for (const key of LEGACY_KEYS) localStorage.removeItem(key)
    const json = localStorage.getItem(STORAGE_KEY)
    return json ? parseMarked(json, ids) : []
  } catch {
    return []
  }
}

export function saveMarked(marked) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(marked))
  } catch {
    // storage unavailable (private mode / quota): the board still works, it just won't survive a refresh
  }
}

export const withMarked = (marked, n) => (marked.includes(n) ? marked : [...marked, n].sort((a, b) => a - b))

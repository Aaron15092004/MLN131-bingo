import { memo } from 'react'

// >= 56px on 1080p: 64px for short questions, 56px once the text would need a 4th line.
const LONG_QUESTION = 95

export const QuestionCard = memo(function QuestionCard({ question }) {
  const size = question.q.length > LONG_QUESTION ? 'text-question-sm' : 'text-question'
  return (
    <section
      aria-label="Câu hỏi"
      className="relative rounded-3xl border-2 border-ink-500 bg-ink-800 px-14 py-9 shadow-[0_1rem_3rem_rgb(0_0_0/0.35)]"
    >
      <span aria-hidden="true" className="absolute inset-y-8 left-0 w-2 rounded-r-full bg-gold-400" />
      <p className={`${size} text-balance font-bold text-paper`}>{question.q}</p>
    </section>
  )
})

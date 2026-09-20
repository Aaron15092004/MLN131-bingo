import { Options } from './Options.jsx'
import { QuestionCard } from './QuestionCard.jsx'
import { SideColumn } from './SideColumn.jsx'

const slot = 'min-h-[9rem] flex-1 rounded-3xl border-[3px]'

// The screen for one opened number: question, four options to pick from, the result, timer and back button.
// The explanation is only rendered after a correct pick, because it usually gives the answer away.
export function QuestionView({ question, answer, timer, onSelect, onBack }) {
  return (
    <div className="grid min-h-0 flex-1 animate-rise grid-cols-[minmax(0,1fr)_23rem] gap-x-10">
      <div className="flex min-h-0 min-w-0 flex-col gap-5">
        <QuestionCard question={question} />
        <Options options={question.options} answer={answer} onSelect={onSelect} />

        {/* a fixed slot, so the result fills space instead of shifting the options */}
        <section aria-label="Kết quả" aria-live="polite" className="flex">
          {answer === null ? (
            <div className={`${slot} grid place-items-center border-dashed border-ink-500 px-10 text-center text-2xl font-semibold text-mist`}>
              Chọn một phương án để trả lời: bấm vào phương án hoặc nhấn A, B, C, D.
            </div>
          ) : answer.correct ? (
            <div className={`${slot} animate-rise border-gold-400 bg-ink-800 px-10 py-4`}>
              <p className="text-xl font-extrabold uppercase tracking-[0.25em] text-gold-300">Đúng · Đã khoanh số {question.id}</p>
              {question.explain && <p className="mt-1 text-balance text-explain font-semibold text-paper">{question.explain}</p>}
            </div>
          ) : (
            <div className={`${slot} animate-rise border-crimson-300 bg-crimson-800 px-10 py-4`}>
              <p className="text-xl font-extrabold uppercase tracking-[0.25em] text-gold-300">Chưa đúng</p>
              <p className="mt-1 text-balance text-explain font-semibold text-paper">Số {question.id} được giữ lại, chưa khoanh. Đáp án đúng không được công bố.</p>
            </div>
          )}
        </section>
      </div>

      <SideColumn timer={timer} answer={answer} onBack={onBack} />
    </div>
  )
}

import { ArrowRight, Scale } from 'lucide-react'
import { Kbd, btn } from './ui.jsx'

// Shown before the password screen, so it can only use what is stored in the clear next to the encrypted data.
const buildRules = (count, seconds) => [
  {
    title: 'Chuẩn bị',
    text: `Mỗi người chơi có một phiếu giấy A4 kẻ 5×5, các ô ghi số từ 1 đến ${count}.`,
  },
  {
    title: 'Chọn số',
    text: `Một người chơi chọn một số từ 1 đến ${count} để mở câu hỏi. Số đã khoanh thì không chọn lại được.`,
  },
  {
    title: 'Trả lời',
    text: `Chọn 1 trong 4 phương án A, B, C, D trong thời gian đếm ngược ${seconds} giây.`,
  },
  {
    title: 'Trả lời đúng',
    tone: 'good',
    text: 'Người đó chốt được số: số được khoanh trên bảng, và cả lớp cùng khoanh số đó vào phiếu giấy của mình.',
  },
  {
    title: 'Trả lời sai',
    tone: 'bad',
    text: 'Số được giữ lại, chưa khoanh. Đáp án đúng không được công bố. Số đó có thể được chọn lại sau.',
  },
  {
    title: 'BINGO',
    tone: 'win',
    text: 'Cứ tiếp tục như vậy cho đến khi có người khoanh đủ 2 hàng trên phiếu của mình: người đó hô BINGO và thắng.',
  },
]

const card = {
  default: { box: 'border-ink-500 bg-ink-800 text-paper', title: 'text-gold-300', badge: 'border-gold-300 bg-gold-400 text-ink-900' },
  good: { box: 'border-gold-400 bg-ink-800 text-paper', title: 'text-gold-300', badge: 'border-gold-300 bg-gold-400 text-ink-900' },
  bad: { box: 'border-crimson-300 bg-ink-800 text-paper', title: 'text-crimson-300', badge: 'border-crimson-300 bg-crimson-800 text-paper' },
  win: { box: 'border-gold-300 bg-gold-400 text-ink-900', title: 'text-ink-900', badge: 'border-ink-900 bg-ink-900 text-gold-300' },
}

// First screen: the rules of the game, then on to the password screen.
// Sized to need about 49rem of height, so it fits every browser window (the UI scale keeps at least ~52rem available).
export function Rules({ vault, onStart }) {
  const [main, sub] = (vault.title ?? 'Bingo').split(/:\s*/)
  const rules = buildRules(vault.questionCount ?? 25, vault.timerSeconds ?? 20)

  return (
    <main className="flex min-h-dvh animate-rise flex-col gap-5 bg-[radial-gradient(90rem_36rem_at_50%_-8rem,rgb(246_201_69/0.10),transparent_65%),linear-gradient(var(--color-ink-900),var(--color-ink-950))] px-14 py-6">
      <header className="flex items-center justify-between gap-8">
        <div className="flex items-center gap-5">
          <Scale aria-hidden="true" className="size-14 shrink-0 text-gold-400" strokeWidth={2.25} />
          <div>
            <p className="text-xl font-bold leading-tight text-gold-400">
              {main}
              {sub && ` · ${sub}`}
            </p>
            <h1 className="text-[3.5rem] font-extrabold leading-none">Luật chơi</h1>
          </div>
        </div>
        <button type="button" onClick={onStart} autoFocus className={`${btn.gold} min-h-16 shrink-0 gap-3 px-8 text-[1.75rem]`}>
          Bắt đầu
          <ArrowRight aria-hidden="true" className="size-8" strokeWidth={2.75} />
          <Kbd>Enter</Kbd>
        </button>
      </header>

      {/* rows fill the screen when it is tall, but never get shorter than their text when it is not */}
      <ol className="m-0 grid min-h-0 flex-1 list-none auto-rows-[minmax(min-content,1fr)] grid-cols-2 gap-4 p-0">
        {rules.map((rule, i) => {
          const c = card[rule.tone ?? 'default']
          return (
            <li key={rule.title} className={`${c.box} flex flex-col justify-center gap-2.5 rounded-3xl border-[3px] px-7 py-4`}>
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className={`${c.badge} grid size-12 shrink-0 place-items-center rounded-full border-[3px] text-[1.75rem] font-extrabold leading-none tabular-nums`}
                >
                  {i + 1}
                </span>
                <h2 className={`${c.title} text-[2.25rem] font-extrabold leading-tight`}>{rule.title}</h2>
              </div>
              <p className="text-balance text-[1.875rem] font-semibold leading-snug">{rule.text}</p>
            </li>
          )
        })}
      </ol>
    </main>
  )
}

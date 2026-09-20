import { useState } from 'react'
import vault from './data/questions.enc.json'
import { Unlock } from './components/Unlock.jsx'
import { getDataProblems } from './lib/data.js'
import HostView from './views/HostView.jsx'

function DataProblems({ problems }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[70rem] flex-col justify-center gap-6 px-10 py-16">
      <h1 className="text-5xl font-extrabold text-crimson-300">Không đọc được dữ liệu câu hỏi</h1>
      <p className="text-2xl font-semibold text-mist">Hãy sửa file src/data/questions.json, chạy npm run encrypt rồi tải lại trang:</p>
      <ul className="list-disc space-y-2 pl-8 text-2xl font-bold">
        {problems.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </main>
  )
}

export default function App() {
  // The site ships only the encrypted questions. Once unlocked they live in memory only, never in storage.
  const [data, setData] = useState(null)
  if (!data) return <Unlock vault={vault} onUnlock={setData} />

  const problems = getDataProblems(data)
  return problems.length ? <DataProblems problems={problems} /> : <HostView data={data} />
}

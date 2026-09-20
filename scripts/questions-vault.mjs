// npm run encrypt   src/data/questions.json      -> src/data/questions.enc.json   (the file the site actually ships)
// npm run decrypt   src/data/questions.enc.json  -> src/data/questions.json       (restore the editable file)
//
// The plaintext questions.json is git-ignored and never imported by the app.
// Password: environment variable BINGO_PASSWORD, or typed in when run in a terminal.
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { getDataProblems } from '../src/lib/data.js'
import { decryptJson, encryptJson } from '../src/lib/vault.js'

const PLAIN = new URL('../src/data/questions.json', import.meta.url)
const ENCRYPTED = new URL('../src/data/questions.enc.json', import.meta.url)
const [mode, ...flags] = process.argv.slice(2)

function askHidden(prompt) {
  if (!process.stdin.isTTY) {
    throw new Error('Không nhập được mật khẩu ở đây. Hãy đặt biến môi trường BINGO_PASSWORD (PowerShell: $env:BINGO_PASSWORD="...") hoặc chạy trong terminal thường.')
  }
  process.stdout.write(prompt)
  const stdin = process.stdin
  stdin.setRawMode(true)
  stdin.resume()
  stdin.setEncoding('utf8')
  return new Promise((resolve) => {
    let text = ''
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === '\r' || ch === '\n') {
          stdin.setRawMode(false)
          stdin.pause()
          stdin.off('data', onData)
          process.stdout.write('\n')
          return resolve(text)
        }
        if (ch === '\u0003') process.exit(130) // Ctrl+C
        text = ch === '\u007f' || ch === '\b' ? text.slice(0, -1) : text + ch
      }
    }
    stdin.on('data', onData)
  })
}

async function readPassword({ confirm }) {
  if (process.env.BINGO_PASSWORD) return process.env.BINGO_PASSWORD
  const password = await askHidden('Mật khẩu: ')
  if (!password) throw new Error('Mật khẩu không được để trống.')
  if (confirm && (await askHidden('Nhập lại mật khẩu: ')) !== password) throw new Error('Hai lần nhập mật khẩu không khớp.')
  return password
}

async function encrypt() {
  if (!existsSync(PLAIN)) throw new Error('Không thấy src/data/questions.json (file câu hỏi dạng thường).')
  const data = JSON.parse(await readFile(PLAIN, 'utf8'))
  const problems = getDataProblems(data)
  if (problems.length) throw new Error(`questions.json có lỗi, chưa mã hóa:\n - ${problems.join('\n - ')}`)

  const password = await readPassword({ confirm: true })
  // the title is not secret: it is stored in the clear so the lock screen can show it
  const vault = { title: data.meta.title, ...(await encryptJson(data, password)) }
  // prove the file we are about to write really opens with this password
  const back = await decryptJson(vault, password)
  if (JSON.stringify(back) !== JSON.stringify(data)) throw new Error('Kiểm tra giải mã thất bại, chưa ghi file.')

  await writeFile(ENCRYPTED, `${JSON.stringify(vault, null, 2)}\n`)
  console.log(`Đã mã hóa ${data.questions.length} câu hỏi -> src/data/questions.enc.json`)
}

async function decrypt() {
  if (existsSync(PLAIN) && !flags.includes('--force')) {
    throw new Error('src/data/questions.json đã tồn tại, giải mã sẽ ghi đè. Thêm --force nếu đúng ý: npm run decrypt -- --force')
  }
  const vault = JSON.parse(await readFile(ENCRYPTED, 'utf8'))
  const data = await decryptJson(vault, await readPassword({ confirm: false }))
  await writeFile(PLAIN, `${JSON.stringify(data, null, 2)}\n`)
  console.log(`Đã khôi phục ${data.questions.length} câu hỏi -> src/data/questions.json`)
}

try {
  if (mode === 'encrypt') await encrypt()
  else if (mode === 'decrypt') await decrypt()
  else throw new Error('Cách dùng: npm run encrypt | npm run decrypt')
} catch (err) {
  console.error(err?.name === 'OperationError' ? 'Sai mật khẩu.' : err.message)
  process.exit(1)
}

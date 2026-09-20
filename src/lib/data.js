// Human-readable problems with questions.json (empty array = OK).
// Used fields: meta.title, meta.timerSeconds and questions[] { id, q, options[], answer "A".., explain? }.
export function getDataProblems(data) {
  if (!data?.meta || !Array.isArray(data.questions)) return ['File questions.json thiếu mục "meta" hoặc "questions".']

  const problems = []
  if (!data.meta.title) problems.push('meta.title không được để trống.')
  if (!(data.meta.timerSeconds > 0)) problems.push('meta.timerSeconds phải lớn hơn 0.')
  if (data.questions.length === 0) problems.push('Chưa có câu hỏi nào trong "questions".')

  const ids = data.questions.map((q) => q.id)
  if (ids.some((id) => !Number.isInteger(id) || id < 1)) problems.push('Mỗi câu hỏi cần có "id" là số nguyên từ 1 trở lên.')
  if (new Set(ids).size !== ids.length) problems.push('Có id câu hỏi bị trùng.')

  for (const q of data.questions) {
    const tag = `Câu ${q.id}`
    if (!q.q) problems.push(`${tag}: thiếu "q" (nội dung câu hỏi).`)
    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.some((o) => !o)) {
      problems.push(`${tag}: "options" cần có ít nhất 2 phương án, không được để trống.`)
    } else if (!/^[A-Z]$/.test(q.answer) || q.answer.charCodeAt(0) - 65 >= q.options.length) {
      problems.push(`${tag}: "answer" phải là một chữ cái từ A đến ${String.fromCharCode(64 + q.options.length)}.`)
    }
  }
  return problems
}

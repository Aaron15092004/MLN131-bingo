// Password-based encryption of the question data: AES-256-GCM, key derived with PBKDF2-SHA256.
// Uses only Web Crypto, so the exact same code runs in the browser (to unlock) and in Node (scripts/questions-vault.mjs).
// The deployed site ships only the encrypted blob, so the answers cannot be read from the page source without the password.

const ITERATIONS = 600_000
const encoder = new TextEncoder()
const decoder = new TextDecoder()

const toBase64 = (bytes) => {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(binary)
}
const fromBase64 = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0))

async function deriveKey(password, salt, iterations, usage) {
  const material = await crypto.subtle.importKey('raw', encoder.encode(password.normalize('NFC')), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, [usage])
}

export async function encryptJson(value, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt, ITERATIONS, 'encrypt')
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(value)))
  return { v: 1, kdf: 'PBKDF2-SHA256', iter: ITERATIONS, salt: toBase64(salt), iv: toBase64(iv), data: toBase64(new Uint8Array(cipher)) }
}

// Rejects with a DOMException named "OperationError" when the password is wrong (AES-GCM authentication fails).
export async function decryptJson(vault, password) {
  if (vault?.v !== 1) throw new Error('Định dạng dữ liệu không được hỗ trợ.')
  const key = await deriveKey(password, fromBase64(vault.salt), vault.iter, 'decrypt')
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(vault.iv) }, key, fromBase64(vault.data))
  return JSON.parse(decoder.decode(plain))
}

/**
 * Web3 End-to-End Encryption Utilities using Web Crypto API (AES-GCM 256-bit)
 * Encrypts chat messages client-side before sending to Supabase WebSockets.
 */

async function deriveKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('skillmax_monad_chat_salt_2026'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptMessage(text: string, secretKey: string): Promise<string> {
  try {
    const key = await deriveKey(secretKey)
    const enc = new TextEncoder()
    const iv = window.crypto.getRandomValues(new Uint8Array(12))

    const ciphertext = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(text)
    )

    const ivHex = Array.from(iv).map((b) => b.toString(16).padStart(2, '0')).join('')
    const cipherHex = Array.from(new Uint8Array(ciphertext))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    return `[ENC:AES-GCM]:${ivHex}:${cipherHex}`
  } catch (err) {
    console.error('Encryption error:', err)
    return text
  }
}

export async function decryptMessage(cipherText: string, secretKey: string): Promise<string> {
  if (!cipherText.startsWith('[ENC:AES-GCM]:')) {
    return cipherText // Legacy plaintext fallback
  }

  try {
    const parts = cipherText.split(':')
    if (parts.length !== 3) return cipherText

    const ivHex = parts[1]
    const cipherHex = parts[2]

    const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))
    const ciphertext = new Uint8Array(cipherHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))

    const key = await deriveKey(secretKey)
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    )

    const dec = new TextDecoder()
    return dec.decode(decryptedBuffer)
  } catch (err) {
    console.error('Decryption failed:', err)
    return '🔒 [Encrypted Message]'
  }
}

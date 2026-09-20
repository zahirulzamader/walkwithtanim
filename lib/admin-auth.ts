import crypto from 'crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'wt_admin'
const TOKEN_MESSAGE = 'walkwithtanim-admin-v1'

export function getAdminCookieName(): string {
  return COOKIE_NAME
}

// Deterministic token derived from the owner passcode. Only the server, which
// knows the passcode, can produce it — so a valid cookie proves admin identity.
export function makeAdminToken(): string | null {
  const pass = process.env.JOURNAL_PASSCODE
  if (!pass) return null
  return crypto.createHmac('sha256', pass).update(TOKEN_MESSAGE).digest('hex')
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  try {
    return crypto.timingSafeEqual(ba, bb)
  } catch {
    return false
  }
}

export function verifyPasscode(passcode: string): boolean {
  const expected = process.env.JOURNAL_PASSCODE ?? ''
  if (!expected) return false
  return safeEqual(passcode, expected)
}

export async function isAdmin(): Promise<boolean> {
  const token = makeAdminToken()
  if (!token) return false
  const store = await cookies()
  const value = store.get(COOKIE_NAME)?.value
  if (!value) return false
  return safeEqual(value, token)
}

import { headers } from 'next/headers'

// Canonical fallback used at build time and when no request headers are available.
export const FALLBACK_SITE_URL =
  process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'

/**
 * Resolve the live site origin at request time.
 * Prefers the forwarded host (correct on the deployed/custom domain),
 * falling back to NEXTAUTH_URL / the known deployment URL.
 */
export async function getSiteUrl(): Promise<string> {
  try {
    const h = await headers()
    const host = h.get('x-forwarded-host') || h.get('host')
    if (host) {
      const proto = h.get('x-forwarded-proto') || 'https'
      return `${proto}://${host}`
    }
  } catch {
    // headers() unavailable (e.g. fully static context) — use fallback
  }
  return FALLBACK_SITE_URL.replace(/\/$/, '')
}

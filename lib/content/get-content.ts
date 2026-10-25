import { prisma } from '@/lib/db'
import {
  defaultContent,
  SECTION_KEYS,
  type SiteContent,
  type SectionKey,
} from './defaults'

// Server-side: load all editable content, merging any saved values over the
// code defaults. Always returns a complete, safe content object — even when the
// database is unavailable (e.g. before a database is connected on a new host).
export async function getAllContent(): Promise<SiteContent> {
  const result: SiteContent = structuredClone(defaultContent)
  if (!prisma) return result
  try {
    const rows = await prisma.siteContent.findMany()
    for (const row of rows) {
      const key = row.section as SectionKey
      if (!SECTION_KEYS.includes(key)) continue
      const saved = row.data as Record<string, unknown> | null
      if (saved && typeof saved === 'object') {
        // Shallow-merge saved fields over defaults so new default fields still appear.
        result[key] = { ...(result[key] as object), ...saved } as never
      }
    }
    // Defensive: coerce any legacy string[] partners into { name, logo } objects.
    const vlog = result.vlog as { partners?: unknown }
    if (Array.isArray(vlog?.partners)) {
      vlog.partners = vlog.partners.map((p: unknown) =>
        typeof p === 'string'
          ? { name: p, logo: '' }
          : { name: (p as any)?.name ?? '', logo: (p as any)?.logo ?? '' }
      ) as never
    }
  } catch (err: any) {
    console.error('getAllContent error:', err?.message ?? err)
  }
  return result
}

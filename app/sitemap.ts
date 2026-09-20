import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = await getSiteUrl()
  const lastModified = new Date()

  // Single-page site: the primary URL plus in-page section anchors so search
  // engines surface the key sections as sitelinks.
  const sections = ['about', 'journey', 'education', 'skills', 'vlog', 'gallery', 'journal', 'contact']

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...sections.map((id) => ({
      url: `${siteUrl}/#${id}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}

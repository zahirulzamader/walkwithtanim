import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Md Zahirul Islam — Explorer, Storyteller & Influencer',
    short_name: 'Zahirul Islam',
    description:
      'Personal portfolio of Md Zahirul Islam — travel, culture & lifestyle content creator based in Rome, Italy.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0F2C',
    theme_color: '#0A0F2C',
    icons: [
      { src: '/logo.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}

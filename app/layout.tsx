import type { Metadata } from 'next'
import { DM_Sans, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'
import { FALLBACK_SITE_URL } from '@/lib/site'
import ColorCycler from './components/color-cycler'
import CursorRipple from './components/cursor-ripple'

export const dynamic = 'force-dynamic'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const jakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

const siteUrl = FALLBACK_SITE_URL.replace(/\/$/, '')
const title = 'Md Zahirul Islam – Explorer · Storyteller · Influencer'
const description =
  'Personal portfolio of Md Zahirul Islam (Walk with Tanim) — a travel, culture & lifestyle content creator based in Rome, Italy. From the shores of Bangladesh to the streets of Rome, sharing authentic stories, cultures & adventures with the world.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: '%s | Md Zahirul Islam',
  },
  description,
  applicationName: 'Md Zahirul Islam Portfolio',
  authors: [{ name: 'Md Zahirul Islam', url: siteUrl }],
  creator: 'Md Zahirul Islam',
  publisher: 'Md Zahirul Islam',
  keywords: [
    'Md Zahirul Islam',
    'Walk with Tanim',
    'travel vlogger',
    'travel blogger Rome',
    'lifestyle influencer',
    'cultural storyteller',
    'travel content creator',
    'Bangladesh travel',
    'Italy travel vlog',
    'tourism and cultural heritage',
    'personal portfolio',
  ],
  category: 'Travel & Lifestyle',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: 'Md Zahirul Islam',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Md Zahirul Islam – Explorer, Storyteller & Influencer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    site: '@Xahirul_1998',
    creator: '@Xahirul_1998',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export const viewport = {
  themeColor: '#0A0F2C',
  width: 'device-width',
  initialScale: 1,
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Md Zahirul Islam',
  alternateName: 'Walk with Tanim',
  url: siteUrl,
  image: `${siteUrl}/logo.png`,
  jobTitle: 'Content Creator & Travel Storyteller',
  description,
  homeLocation: {
    '@type': 'Place',
    name: 'Rome, Italy',
  },
  nationality: {
    '@type': 'Country',
    name: 'Bangladesh',
  },
  knowsLanguage: ['Bengali', 'English', 'Italian'],
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Università degli Studi di Roma Tor Vergata' },
    { '@type': 'CollegeOrUniversity', name: 'Daugavpils University' },
    { '@type': 'CollegeOrUniversity', name: 'National University, Bangladesh' },
  ],
  sameAs: [
    'https://www.instagram.com/walk_with_tanim',
    'https://www.facebook.com/zahirul.zamader',
    'https://www.facebook.com/profile.php?id=61567227817028',
    'https://x.com/Xahirul_1998',
    'https://www.linkedin.com/in/md-zahirul-islam-b8962b149/',
    'https://threads.net/@walk_with_tanim',
    'https://telegram.me/Tanim_Rahman',
    'https://github.com/zahirulzamader',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={`${dmSans.variable} ${jakartaSans.variable} ${jetbrainsMono.variable} font-sans`}>
        <ColorCycler />
        <CursorRipple />
        {children}
        <Toaster />
        <ChunkLoadErrorHandler />
      </body>
    </html>
  )
}

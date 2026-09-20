export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAdmin } from '@/lib/admin-auth'

export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json({ success: true, entries: [] })
    }
    const entries = await prisma.journalEntry.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, entries })
  } catch (err: any) {
    console.error('Journal GET error:', err?.message ?? err)
    return NextResponse.json({ success: false, entries: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, message: 'You are not authorized to add stories.' },
        { status: 401 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { success: false, message: 'Database not configured yet.' },
        { status: 503 }
      )
    }

    const data = await request.json()

    const place = (data?.place ?? '').trim()
    const country = (data?.country ?? '').trim()
    const experience = (data?.experience ?? '').trim()

    if (!place || !country || !experience) {
      return NextResponse.json(
        { success: false, message: 'Place, country and your experience are required.' },
        { status: 400 }
      )
    }

    const entry = await prisma.journalEntry.create({
      data: {
        place,
        country,
        flag: (data?.flag ?? '✈️').trim() || '✈️',
        imageUrl: (data?.imageUrl ?? '').trim(),
        experience,
        gettingThere: (data?.gettingThere ?? '').trim(),
        tips: (data?.tips ?? '').trim(),
      },
    })

    return NextResponse.json({ success: true, entry })
  } catch (err: any) {
    console.error('Journal POST error:', err?.message ?? err)
    return NextResponse.json(
      { success: false, message: 'Failed to save your story. Please try again.' },
      { status: 500 }
    )
  }
}

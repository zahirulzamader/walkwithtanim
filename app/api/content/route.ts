export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAdmin } from '@/lib/admin-auth'
import { getAllContent } from '@/lib/content/get-content'
import { SECTION_KEYS, type SectionKey } from '@/lib/content/defaults'

// Public: returns the full merged content (defaults + any saved edits).
export async function GET() {
  const content = await getAllContent()
  return NextResponse.json({ success: true, content })
}

// Admin only: save one section's content.
export async function PUT(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, message: 'You are not authorized to edit content.' },
        { status: 401 }
      )
    }
    if (!prisma) {
      return NextResponse.json(
        { success: false, message: 'Database not configured yet. Connect a database to save changes.' },
        { status: 503 }
      )
    }

    const payload: unknown = await request.json().catch(() => null)
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return NextResponse.json(
        { success: false, message: 'Invalid request.' },
        { status: 400 }
      )
    }

    const section = (payload as Record<string, unknown>).section
    const data = (payload as Record<string, unknown>).data

    if (typeof section !== 'string' || !SECTION_KEYS.includes(section as SectionKey)) {
      return NextResponse.json(
        { success: false, message: 'Unknown section.' },
        { status: 400 }
      )
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return NextResponse.json(
        { success: false, message: 'Invalid content data.' },
        { status: 400 }
      )
    }

    const serialized = JSON.stringify(data)
    if (serialized.length > 200_000) {
      return NextResponse.json(
        { success: false, message: 'Content is too large.' },
        { status: 400 }
      )
    }

    await prisma.siteContent.upsert({
      where: { section },
      create: { section, data: data as object },
      update: { data: data as object },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Content PUT error:', err?.message ?? err)
    return NextResponse.json(
      { success: false, message: 'Failed to save. Please try again.' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const email = (data?.email ?? '').trim().toLowerCase()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const existing = await prisma.emailSubscriber.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already subscribed!' })
    }

    await prisma.emailSubscriber.create({
      data: { email },
    })

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' })
  } catch (err: any) {
    console.error('Subscribe error:', err?.message ?? err)
    return NextResponse.json(
      { success: false, message: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}

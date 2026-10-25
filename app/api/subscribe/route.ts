export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { success: false, message: 'Database not configured yet.' },
        { status: 503 }
      )
    }

    const payload: unknown = await request.json().catch(() => null)
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    const emailValue = (payload as Record<string, unknown>).email
    const email = typeof emailValue === 'string' ? emailValue.trim().toLowerCase() : ''

    if (
      !email ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    const existing = await prisma.emailSubscriber.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already subscribed!' })
    }

    try {
      await prisma.emailSubscriber.create({
        data: { email },
      })
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        return NextResponse.json({ success: true, message: 'Already subscribed!' })
      }
      throw err
    }

    // Notify the owner that a new person subscribed (best-effort, never blocks subscribe)
    const emailConfigured = Boolean(
      process.env.ABACUSAI_API_KEY &&
        process.env.NOTIF_ID_NEW_SUBSCRIBER &&
        process.env.WEB_APP_ID
    )
    if (emailConfigured) {
      try {
        const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const hostname = new URL(appUrl).hostname
        const safeEmail = email.replace(/[&<>"']/g, (ch) => (
          { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] as string
        ))
        const htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4A017; border-bottom: 2px solid #D4A017; padding-bottom: 10px;">
              New Subscriber 🎉
            </h2>
            <p style="margin: 16px 0;">Someone just subscribed to be notified when you go live:</p>
            <p style="margin: 10px 0; font-size: 16px;"><strong>${safeEmail}</strong></p>
          </div>
        `
        await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.ABACUSAI_API_KEY}`,
          },
          body: JSON.stringify({
            app_id: process.env.WEB_APP_ID,
            notification_id: process.env.NOTIF_ID_NEW_SUBSCRIBER,
            subject: `New subscriber: ${email}`,
            body: htmlBody,
            is_html: true,
            recipient_email: 'zahirulislamtanim@gmail.com',
            reply_to: email,
            sender_email: `noreply@${hostname}`,
            sender_alias: 'Walk With Tanim',
          }),
        })
      } catch (emailErr: any) {
        console.error('Subscriber notification failed:', emailErr?.message ?? emailErr)
      }
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' })
  } catch (err: any) {
    console.error('Subscribe error:', err?.message ?? err)
    return NextResponse.json(
      { success: false, message: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}

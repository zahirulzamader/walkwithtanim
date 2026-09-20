export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const name = (data?.name ?? '').trim()
    const email = (data?.email ?? '').trim()
    const subject = (data?.subject ?? '').trim()
    const message = (data?.message ?? '').trim()

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Save to database (if configured)
    if (prisma) {
      await prisma.contactSubmission.create({
        data: { name, email, subject, message },
      })
    }

    // Send email notification (Abacus-specific — works only on Abacus platform)
    try {
      if (process.env.ABACUSAI_API_KEY && process.env.NOTIF_ID_CONTACT_FORM_SUBMISSION) {
        const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const hostname = new URL(appUrl).hostname

        const htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4A017; border-bottom: 2px solid #D4A017; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject || 'N/A'}</p>
              <p style="margin: 10px 0;"><strong>Message:</strong></p>
              <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #D4A017;">
                ${message}
              </div>
            </div>
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
            notification_id: process.env.NOTIF_ID_CONTACT_FORM_SUBMISSION,
            subject: `New Contact: ${name} - ${subject || 'Portfolio Inquiry'}`,
            body: htmlBody,
            is_html: true,
            recipient_email: 'self.mdzahirulislam@gmail.com',
            reply_to: email,
            sender_email: `noreply@${hostname}`,
            sender_alias: 'Zahirul Islam Portfolio',
          }),
        })
      }
    } catch (emailErr: any) {
      console.error('Email notification failed:', emailErr?.message ?? emailErr)
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully' })
  } catch (err: any) {
    console.error('Contact form error:', err?.message ?? err)
    return NextResponse.json(
      { success: false, message: 'Failed to send message' },
      { status: 500 }
    )
  }
}

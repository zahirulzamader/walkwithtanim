export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function getTextField(data: Record<string, unknown>, key: string): string {
  const value = data[key]
  return typeof value === 'string' ? value.trim() : ''
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return entities[char]
  })
}

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json().catch(() => null)
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return NextResponse.json(
        { success: false, message: 'Please submit a valid contact form.' },
        { status: 400 }
      )
    }

    const data = payload as Record<string, unknown>
    const name = getTextField(data, 'name')
    const email = getTextField(data, 'email')
    const subject = getTextField(data, 'subject')
    const message = getTextField(data, 'message')

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    if (
      name.length > 120 ||
      email.length > 254 ||
      subject.length > 200 ||
      message.length > 5000 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { success: false, message: 'Please check the form fields and try again.' },
        { status: 400 }
      )
    }

    let savedToDatabase = false
    if (prisma) {
      try {
        await prisma.contactSubmission.create({
          data: { name, email, subject, message },
        })
        savedToDatabase = true
      } catch (err: any) {
        console.error('Contact database save failed:', err?.message ?? err)
      }
    }

    const emailConfigured = Boolean(
      process.env.ABACUSAI_API_KEY &&
        process.env.NOTIF_ID_CONTACT_FORM_SUBMISSION &&
        process.env.WEB_APP_ID
    )
    let notificationSent = false

    try {
      if (emailConfigured) {
        const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        const hostname = new URL(appUrl).hostname
        const safeName = escapeHtml(name)
        const safeEmail = escapeHtml(email)
        const safeSubject = escapeHtml(subject || 'N/A')
        const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>')

        const htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4A017; border-bottom: 2px solid #D4A017; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Name:</strong> ${safeName}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${safeSubject}</p>
              <p style="margin: 10px 0;"><strong>Message:</strong></p>
              <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #D4A017;">
                ${safeMessage}
              </div>
            </div>
          </div>
        `

        const response = await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
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
            recipient_email: 'zahirulislamtanim@gmail.com',
            reply_to: email,
            sender_email: `noreply@${hostname}`,
            sender_alias: 'Zahirul Islam Portfolio',
          }),
        })
        if (!response.ok) {
          throw new Error(`Notification service responded with status ${response.status}.`)
        }
        notificationSent = true
      }
    } catch (emailErr: any) {
      console.error('Email notification failed:', emailErr?.message ?? emailErr)
    }

    if (!savedToDatabase && !notificationSent) {
      return NextResponse.json(
        {
          success: false,
          message: emailConfigured
            ? 'Could not deliver your message. Please try again.'
            : 'Contact delivery is not configured yet.',
        },
        { status: emailConfigured ? 502 : 503 }
      )
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

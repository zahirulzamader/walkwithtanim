export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  if (!prisma) {
    return NextResponse.json(
      { success: false, message: 'DATABASE_URL is not configured. Add it to your Vercel environment variables.' },
      { status: 500 }
    )
  }

  try {
    // Test connection and create tables if needed using raw SQL
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ContactSubmission" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "subject" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'new',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "EmailSubscriber" (
        "id" SERIAL PRIMARY KEY,
        "email" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "EmailSubscriber_email_key" ON "EmailSubscriber"("email")
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "JournalEntry" (
        "id" SERIAL PRIMARY KEY,
        "place" TEXT NOT NULL,
        "country" TEXT NOT NULL,
        "flag" TEXT NOT NULL DEFAULT '✈️',
        "imageUrl" TEXT NOT NULL DEFAULT '',
        "experience" TEXT NOT NULL,
        "gettingThere" TEXT NOT NULL DEFAULT '',
        "tips" TEXT NOT NULL DEFAULT '',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)

    return NextResponse.json({
      success: true,
      message: 'Database tables created successfully! Your site is now fully functional.'
    })
  } catch (err: any) {
    console.error('DB setup error:', err?.message ?? err)
    return NextResponse.json(
      { success: false, message: `Database setup failed: ${err?.message ?? 'Unknown error'}` },
      { status: 500 }
    )
  }
}

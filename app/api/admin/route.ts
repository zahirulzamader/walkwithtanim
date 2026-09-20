export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import {
  isAdmin,
  verifyPasscode,
  makeAdminToken,
  getAdminCookieName,
} from '@/lib/admin-auth'

export async function GET() {
  return NextResponse.json({ isAdmin: await isAdmin() })
}

export async function POST(request: Request) {
  try {
    const data = await request.json().catch(() => ({}))
    const passcode = (data?.passcode ?? '').trim()

    if (!verifyPasscode(passcode)) {
      return NextResponse.json(
        { success: false, message: 'Incorrect passcode.' },
        { status: 401 }
      )
    }

    const token = makeAdminToken()
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Admin access is not configured.' },
        { status: 500 }
      )
    }

    const res = NextResponse.json({ success: true })
    res.cookies.set(getAdminCookieName(), token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    return res
  } catch (err: any) {
    console.error('Admin login error:', err?.message ?? err)
    return NextResponse.json(
      { success: false, message: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.set(getAdminCookieName(), '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return res
}

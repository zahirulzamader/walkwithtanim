export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { generatePresignedUploadUrl, getFileUrl } from '@/lib/s3'

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, message: 'Not authorized.' },
        { status: 401 }
      )
    }

    const data = await request.json().catch(() => ({}))
    const fileName = (data?.fileName ?? '').trim()
    const contentType = (data?.contentType ?? '').trim()

    if (!fileName || !contentType || !contentType.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Please choose a valid image file.' },
        { status: 400 }
      )
    }

    const { uploadUrl, cloud_storage_path } = await generatePresignedUploadUrl(
      fileName,
      contentType,
      true // public — portfolio photos are displayed to visitors
    )
    const publicUrl = await getFileUrl(cloud_storage_path, contentType, true)

    return NextResponse.json({ success: true, uploadUrl, cloud_storage_path, publicUrl })
  } catch (err: any) {
    console.error('Presigned upload error:', err?.message ?? err)
    return NextResponse.json(
      { success: false, message: 'Could not prepare the upload. Please try again.' },
      { status: 500 }
    )
  }
}

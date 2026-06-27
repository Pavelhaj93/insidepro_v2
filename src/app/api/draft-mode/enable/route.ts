import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  ;(await draftMode()).enable()
  redirect(request.nextUrl.searchParams.get('redirect') ?? '/')
}

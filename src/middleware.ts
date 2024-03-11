import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const user = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const path = request.nextUrl.pathname

  if (
    !user &&
    (path.startsWith('/tasks') ||
      path.startsWith('/submissions') ||
      path.startsWith('/scoreboard') ||
      path.startsWith('/profile'))
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  } else if (
    user &&
    (path === '/' || path === '/login' || path === '/register')
  ) {
    return NextResponse.redirect(new URL('/tasks', request.url))
  }
  return NextResponse.next()
}

import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const user = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const path = req.nextUrl.pathname

  if (
    !user &&
    (path.startsWith('/tasks') ||
      path.startsWith('/submissions') ||
      path.startsWith('/scoreboard') ||
      path.startsWith('/profile'))
  ) {
    return NextResponse.redirect(new URL('/login', req.url))
  } else if (user && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/', req.url))
  } else if (path.startsWith('/dashboard')) {
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.error()
    } else if (path === '/dashboard') {
      return NextResponse.redirect(new URL('/dashboard/users', req.url))
    }
  }
  return NextResponse.next()
}

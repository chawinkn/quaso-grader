import prisma from '@/lib/prisma'
import { json, unauthorized, badRequest } from '@/utils/apiResponse'
import { getServerUser } from '@/lib/session'
import { NextRequest } from 'next/server'

export async function GET() {
  const user = await getServerUser()
  if (!user) return unauthorized()

  const res = await prisma.announcement.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
  return json(res)
}

export async function POST(req: NextRequest) {
  const user = await getServerUser()
  if (!user) return unauthorized()

  const { userId, title, content } = await req.json()
  if (!userId || !title || !content) return badRequest()

  await prisma.announcement.create({
    data: {
      title,
      content,
      createdById: userId,
    },
  })

  return json({ success: true })
}

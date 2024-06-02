import prisma from '@/lib/prisma'
import {
  badRequest,
  internalServerError,
  json,
  unauthorized,
} from '@/utils/apiResponse'
import { getServerUser } from '@/lib/session'
import { NextRequest } from 'next/server'

export async function GET() {
  const user = await getServerUser()
  if (!user) return unauthorized()

  if (user.role !== 'ADMIN') {
    const res = await prisma.task.findMany({
      orderBy: {
        id: 'asc',
      },
      where: {
        private: false,
      },
    })
    return json(res)
  } else {
    const res = await prisma.task.findMany({
      orderBy: {
        id: 'asc',
      },
    })
    return json(res)
  }
}

export async function POST(req: NextRequest) {
  const { id, title, fullScore } = await req.json()
  if (!id || !title || !fullScore) return badRequest()

  const user = await getServerUser()
  if (!user || user.role !== 'ADMIN') return unauthorized()

  // const existingTask = await prisma.task.findFirst({
  //   where: {
  //     id,
  //   },
  // })
  // if (existingTask) return badRequest('Task already exists')

  await prisma.task.create({
    data: {
      id,
      title,
      fullScore,
      private: true,
    },
  })

  return json({ success: true })
}

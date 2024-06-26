import prisma from '@/lib/prisma'
import { unauthorized, json } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'
import { getServerUser } from '@/lib/session'

export async function GET(
  _: NextRequest,
  {
    params,
  }: {
    params: {
      id: string
    }
  }
) {
  const user = await getServerUser()
  if (!user) return unauthorized()

  if (user.role !== 'ADMIN') {
    const res = await prisma.task.findFirst({
      where: {
        id: params.id,
        private: false,
      },
    })
    return json(res)
  } else {
    const res = await prisma.task.findFirst({
      where: {
        id: params.id,
      },
    })
    return json(res)
  }
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      id: string
    }
  }
) {
  const user = await getServerUser()
  if (!user) return unauthorized()
  if (user.role !== 'ADMIN') return unauthorized()

  const data = await req.json()
  const res = await prisma.task.update({
    where: {
      id: params.id,
    },
    data,
  })
  return json(res)
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      id: string
    }
  }
) {
  const user = await getServerUser()
  if (!user || user.role !== 'ADMIN') return unauthorized()

  await prisma.submission.deleteMany({
    where: {
      taskId: params.id,
    },
  })
  await prisma.task.delete({
    where: {
      id: params.id,
    },
  })

  return json({ success: true })
}

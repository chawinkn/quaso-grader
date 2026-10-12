import prisma from '@/lib/prisma'
import { unauthorized, json, badRequest } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'
import { getServerUser } from '@/lib/session'

export async function GET(
  _: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string
    }>
  }
) {
  const { id } = await params
  const user = await getServerUser()
  if (!user || user.role !== 'ADMIN') return unauthorized()

  const res = await prisma.task.findMany({
    orderBy: {
      id: 'asc',
    },
    where: {
      groupId: id,
    },
  })
  return json(res)
}

export async function DELETE(
  _: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string
    }>
  }
) {
  const { id } = await params
  const user = await getServerUser()
  if (!user || user.role !== 'ADMIN') return unauthorized()

  await prisma.submission.deleteMany({
    where: {
      task: {
        groupId: id,
      },
    },
  })
  await prisma.task.deleteMany({
    where: {
      groupId: id,
    },
  })
  await prisma.group.delete({
    where: {
      id: id,
    },
  })

  return json({ success: true })
}

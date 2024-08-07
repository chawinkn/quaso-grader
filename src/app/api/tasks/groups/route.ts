import prisma from '@/lib/prisma'
import { unauthorized, json, badRequest } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'
import { getServerUser } from '@/lib/session'
import { revalidatePath } from 'next/cache'

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
  if (!user || user.role !== 'ADMIN') return unauthorized()

  const res = await prisma.group.findMany({
    orderBy: {
      id: 'asc',
    },
  })
  return json(res)
}

export async function POST(req: NextRequest) {
  const user = await getServerUser()
  if (!user || user.role !== 'ADMIN') return unauthorized()

  const { id, name } = await req.json()

  const existingGroup = await prisma.group.findFirst({
    where: {
      id,
    },
  })
  if (existingGroup) return badRequest('Group already exists')

  await prisma.group.create({
    data: {
      id,
      name,
    },
  })

  revalidatePath('/dashboard/tasks')

  return json({ success: true })
}

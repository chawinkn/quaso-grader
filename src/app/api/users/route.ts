import prisma from '@/lib/prisma'
import { json, unauthorized } from '@/utils/apiResponse'
import { getServerUser } from '@/lib/session'
import { NextRequest } from 'next/server'
import { badRequest } from '@/utils/apiResponse'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const user = await getServerUser()
  if (!user) return unauthorized()

  const res = await prisma.user.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  })
  return json(res)
}

export async function PUT(req: NextRequest) {
  const user = await getServerUser()
  if (!user) return unauthorized()

  const { id, name } = await req.json()
  if (!id || !name) return badRequest()

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
    },
  })

  revalidatePath(`/profile/${id}`)

  return json({ success: true })
}

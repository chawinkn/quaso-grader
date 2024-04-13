import prisma from '@/lib/prisma'
import { json, unauthorized } from '@/utils/apiResponse'
import { getServerUser } from '@/lib/session'

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

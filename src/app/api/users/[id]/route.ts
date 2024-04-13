import prisma from '@/lib/prisma'
import { json, unauthorized } from '@/utils/apiResponse'
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

  const User = await prisma.user.findUnique({
    where: {
      id: Number(params.id),
    },
  })

  return json(User)
}

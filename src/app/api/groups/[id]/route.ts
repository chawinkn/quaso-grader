import prisma from '@/lib/prisma'
import { unauthorized, json } from '@/utils/apiResponse'
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

  const res = await prisma.group.findFirst({
    where: {
      id: id,
    },
  })
  return json(res)
}

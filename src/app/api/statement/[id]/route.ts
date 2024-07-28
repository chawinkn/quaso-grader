import prisma from '@/lib/prisma'
import { unauthorized, json, forbidden, badRequest } from '@/utils/apiResponse'
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

  const task = await prisma.task.findFirst({
    where: {
      id: params.id,
    },
  })

  if (!task) return json(null)

  if (user.role !== 'ADMIN' && task?.private === true) {
    return forbidden('Task is not available')
  } else {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/desc/${params.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      return res
    } catch (err) {
      return badRequest('Failed to fetch backend api')
    }
  }
}

import prisma from '@/lib/prisma'
import {
  unauthorized,
  json,
  internalServerError,
  forbidden,
} from '@/utils/apiResponse'
import { NextRequest } from 'next/server'
import { getServerUser } from '@/lib/session'
import { notFound } from 'next/navigation'
import NotFound from '@/app/not-found'

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
      const res = await fetch(`http://localhost:5000/desc/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return res
    } catch (err) {
      return internalServerError()
    }
  }
}

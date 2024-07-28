import prisma from '@/lib/prisma'
import { badRequest, json, unauthorized } from '@/utils/apiResponse'
import { getServerUser } from '@/lib/session'
import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const user = await getServerUser()

  if (user?.role !== 'ADMIN') {
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
  const data = await req.formData()

  if (!data.has('id') || !data.has('title') || !data.has('fullScore'))
    return badRequest()

  const id = String(data.get('id'))
  const title = String(data.get('title'))
  const fullScore = Number(data.get('fullScore'))

  const user = await getServerUser()
  if (!user || user.role !== 'ADMIN') return unauthorized()

  const existingTask = await prisma.task.findFirst({
    where: {
      id,
    },
  })
  if (existingTask) return badRequest('Task already exists')

  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/healthchecker`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch {
    return badRequest('Failed to fetch backend api')
  }

  data.delete('id')
  data.delete('title')
  data.delete('fullScore')

  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/task/${id}`, {
      method: 'POST',
      body: data,
    })
  } catch {
    return badRequest('Failed to upload to backend api')
  }

  await prisma.task.create({
    data: {
      id,
      title,
      fullScore,
      private: true,
    },
  })

  revalidatePath('/dashboard/tasks')

  return json({ success: true })
}

import prisma from '@/lib/prisma'
import { unauthorized, json, badRequest } from '@/utils/apiResponse'
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

export async function POST(
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

  const data = await req.formData()
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/task/${params.id}`,
      {
        method: 'POST',
        body: data,
      }
    )
  } catch {
    return badRequest('Failed to upload to backend api')
  }

  return json({ success: true })
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
  if (!user || user.role !== 'ADMIN') return unauthorized()

  const data = await req.json()
  await prisma.task.update({
    where: {
      id: params.id,
    },
    data,
  })
  return json({ success: true })
}

export async function DELETE(
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
  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/task/${params.id}`, {
    method: 'DELETE',
  })

  return json({ success: true })
}

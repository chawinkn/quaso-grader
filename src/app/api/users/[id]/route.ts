import prisma from '@/lib/prisma'
import { json, unauthorized } from '@/utils/apiResponse'
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
  if (isNaN(Number(params.id))) return json(null)

  const User = await prisma.user.findUnique({
    where: {
      id: Number(params.id),
    },
    select: {
      id: true,
      name: true,
      username: true,
      className: true,
    },
  })

  return json(User)
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

  if (isNaN(Number(params.id))) return json(null)

  await prisma.submission.deleteMany({
    where: {
      userId: Number(params.id),
    },
  })

  await prisma.user.delete({
    where: {
      id: Number(params.id),
    },
  })

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

  if (isNaN(Number(params.id))) return json(null)

  const { role, approved } = await req.json()

  const User = await prisma.user.update({
    where: {
      id: Number(params.id),
    },
    data: {
      role,
      approved,
    },
  })

  revalidatePath(`/dashboard`)

  return json(User)
}

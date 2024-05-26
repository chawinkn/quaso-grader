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
  const user = await getServerUser()
  if (!user) return unauthorized()

  if (isNaN(Number(params.id))) return json(null)

  const User = await prisma.user.findUnique({
    where: {
      id: Number(params.id),
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
  if (!user || user.role !== "ADMIN") return unauthorized()

  if (isNaN(Number(params.id))) return json(null)

  const User = await prisma.user.delete({
    where: {
      id: Number(params.id),
    },
  })

  return json(User)
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
  if (!user || user.role !== "ADMIN") return unauthorized()

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

  revalidatePath(`/dashboard`);

  return json(User)
}
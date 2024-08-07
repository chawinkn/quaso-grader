import prisma from '@/lib/prisma'
import { json, unauthorized } from '@/utils/apiResponse'
import { getServerUser } from '@/lib/session'
import { NextRequest, NextResponse } from 'next/server'
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

  const { id, name, role, approved } = await req.json()
  if (!id || !name) return badRequest()
  if (user.role !== 'ADMIN' && user.id !== id) {
    return unauthorized()
  }

  if (user.role === 'ADMIN' && role && approved !== undefined) {
    const update = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        role,
        approved,
      },
    })
    revalidatePath(`/dashboard`)
    return json({
      success: true,
      name: update.name,
      role: update.role,
      approved: update.approved,
    })
  } else {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
    })

    revalidatePath(`/profile/${id}`)
  }

  return json({ success: true })
}

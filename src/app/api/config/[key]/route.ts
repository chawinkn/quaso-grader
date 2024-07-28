import prisma from '@/lib/prisma'
import { badRequest, json, unauthorized } from '@/utils/apiResponse'
import { getServerUser } from '@/lib/session'
import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      key: string
    }
  }
) {
  const user = await getServerUser()
  if (!user) return unauthorized()

  const config = await prisma.configuration.findUnique({
    where: {
      key: params.key,
    },
    select: {
      value: true,
    },
  })

  return json(config)
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      key: string
    }
  }
) {
  const user = await getServerUser()
  if (!user || user.role !== 'ADMIN') return unauthorized()

  const { value } = await req.json()
  if (!value) return badRequest()

  try {
    await prisma.configuration.update({
      where: {
        key: params.key,
      },
      data: {
        value,
      },
    })
  } catch (error) {
    return badRequest(`Config: ${params.key} not found`)
  }

  revalidatePath(`/dashboard/general`)

  return json({ success: true })
}

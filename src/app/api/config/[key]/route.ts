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
    params: Promise<{
      key: string
    }>
  }
) {
  const { key } = await params
  const user = await getServerUser()
  if (!user) return unauthorized()

  const config = await prisma.configuration.findUnique({
    where: {
      key: key,
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
    params: Promise<{
      key: string
    }>
  }
) {
  const { key } = await params
  const user = await getServerUser()
  if (!user || user.role !== 'ADMIN') return unauthorized()

  const { value } = await req.json()
  if (!value) return badRequest()

  try {
    await prisma.configuration.update({
      where: {
        key: key,
      },
      data: {
        value,
      },
    })
  } catch (error) {
    return badRequest(`Config: ${key} not found`)
  }

  revalidatePath(`/dashboard/general`)

  return json({ success: true })
}

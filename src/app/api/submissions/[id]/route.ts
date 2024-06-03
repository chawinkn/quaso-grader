import prisma from '@/lib/prisma'
import { unauthorized, json } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'
import { getServerUser } from '@/lib/session'
import { decompressCode } from '@/lib/compress'

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

  let submission
  if (user.role !== 'ADMIN') {
    submission = await prisma.submission.findFirst({
      where: {
        id: Number(params.id),
        userId: user.id,
      },
    })
  } else {
    submission = await prisma.submission.findFirst({
      where: {
        id: Number(params.id),
      },
    })
  }
  if (submission) {
    const res = { ...submission, code: await decompressCode(submission.code) }
    return json(res)
  }
  return json(submission)
}

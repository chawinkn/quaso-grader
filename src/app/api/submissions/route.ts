import prisma from '@/lib/prisma'
import { compressCode } from '@/lib/compress'
import { NextRequest } from 'next/server'
import { badRequest, json, unauthorized } from '@/utils/apiResponse'
import { getServerUser } from '@/lib/session'

export async function GET() {
  const user = await getServerUser()
  if (!user) return unauthorized()

  const res = await prisma.submission.findMany({
    orderBy: {
      submittedAt: 'desc',
    },
  })
  return json(res)
}

export async function POST(req: NextRequest) {
  const user = await getServerUser()
  if (!user) return unauthorized()

  const { taskId, sourcecode, language } = await req.json()
  if (!taskId || !sourcecode || !language) return badRequest()

  const compressedCode = await compressCode(JSON.stringify(sourcecode))

  const submission = await prisma.submission.create({
    data: {
      taskId,
      status: 'Pending',
      code: compressedCode,
      language,
      userId: user.id,
    },
  })

  return json({ id: submission.id })
}

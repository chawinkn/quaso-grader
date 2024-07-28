import prisma from '@/lib/prisma'
import { compressCode } from '@/lib/compress'
import { NextRequest } from 'next/server'
import { badRequest, json, unauthorized } from '@/utils/apiResponse'
import { getServerUser } from '@/lib/session'

export async function POST(req: NextRequest) {
  const user = await getServerUser()
  if (!user) return unauthorized()

  const { taskId, sourcecode, language } = await req.json()
  if (!taskId || !sourcecode || !language) return badRequest()

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

  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      task_id: taskId,
      submission_id: submission.id,
      code: sourcecode,
      language,
    }),
  })

  return json({ id: submission.id })
}

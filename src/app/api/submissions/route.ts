import prisma from '@/lib/prisma'
import { compressCode } from '@/lib/compress'
import { NextRequest } from 'next/server'
import { badRequest, json, unauthorized } from '@/utils/apiResponse'
import { getServerUser } from '@/lib/session'

export async function GET() {
  const user = await getServerUser()

  if (user?.role !== 'ADMIN') {
    const res = await prisma.submission.findMany({
      where: {
        task: {
          private: false,
        },
        user: {
          approved: true,
        },
      },
      orderBy: {
        id: 'desc',
      },
      select: {
        taskId: true,
        id: true,
        score: true,
        user: {
          select: {
            name: true,
          },
        },
        language: true,
        time: true,
        memory: true,
        submittedAt: true,
        status: true,
        task: {
          select: {
            fullScore: true,
          },
        },
      },
    })
    return json(res)
  } else {
    const res = await prisma.submission.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        taskId: true,
        id: true,
        score: true,
        user: {
          select: {
            name: true,
          },
        },
        language: true,
        time: true,
        memory: true,
        submittedAt: true,
        status: true,
        task: {
          select: {
            fullScore: true,
          },
        },
      },
    })
    return json(res)
  }
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

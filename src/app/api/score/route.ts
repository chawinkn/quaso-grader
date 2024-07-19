import prisma from '@/lib/prisma'
import { json, unauthorized, badRequest } from '@/utils/apiResponse'
import { getServerUser } from '@/lib/session'
import { Prisma } from '@prisma/client'

export async function GET() {
  const user = await getServerUser()

  if (user?.role !== 'ADMIN') {
    const score = (await prisma.$queryRaw(
      Prisma.sql`
        SELECT 
          task_id, max(score) 
        FROM 
          submission 
        JOIN
          task ON submission.task_id = task.id
        WHERE 
          submission.user_id = ${user?.id}
          AND task.private = false
        GROUP BY 
          task_id
      `
    )) as Array<{ task_id: string; max: number }>
    return json(score)
  } else {
    const score = (await prisma.$queryRaw(
      Prisma.sql`
        SELECT 
          task_id, max(score) 
        FROM 
          submission 
        WHERE 
          user_id = ${user?.id} 
        GROUP BY 
          task_id
      `
    )) as Array<{ task_id: string; max: number }>
    return json(score)
  }
}

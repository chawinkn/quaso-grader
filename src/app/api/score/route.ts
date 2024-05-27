import prisma from '@/lib/prisma'
import { json, unauthorized, badRequest } from '@/utils/apiResponse'
import { getServerUser } from '@/lib/session'
import { Prisma } from '@prisma/client'

export async function GET() {
  const user = await getServerUser()
  if (!user) return unauthorized()

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

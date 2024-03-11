import prisma from '@/lib/prisma'
import { json } from '@/utils/apiResponse'

export async function GET() {
  const res = await prisma.task.findMany()
  return json(res)
}

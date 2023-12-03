import prisma from '@/lib/prisma'

export const revalidate = 5

export async function GET() {
  const res = await prisma.problem.findMany({
    orderBy: [
      {
        problemId: 'asc',
      },
    ],
  })
  return Response.json(res)
}

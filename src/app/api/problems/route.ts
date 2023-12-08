import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const revalidate = 5

export async function GET() {
  const res = await prisma.problem.findMany({
    orderBy: [
      {
        problemId: 'asc',
      },
    ],
  })
  return NextResponse.json(res)
}

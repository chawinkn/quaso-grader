import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const res = await prisma.problem.findMany()
  return NextResponse.json(res)
}

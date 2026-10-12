import { getServerUser } from '@/lib/session'
import { badRequest, unauthorized } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function GET(
  _: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string
    }>
  }
) {
  const { id } = await params
  const user = await getServerUser()
  if (!user || user.role !== 'ADMIN') return unauthorized()

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/task/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    return res
  } catch {
    return badRequest('Failed to fetch backend api')
  }
}

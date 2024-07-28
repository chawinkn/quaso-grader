import { getServerUser } from '@/lib/session'
import { badRequest, unauthorized } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function GET(
  _: NextRequest,
  {
    params,
  }: {
    params: {
      id: string
    }
  }
) {
  const user = await getServerUser()
  if (!user || user.role !== 'ADMIN') return unauthorized()

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/task/${params.id}`,
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

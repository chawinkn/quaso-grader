import { getServerUser } from '@/lib/session'
import {
  badRequest,
  internalServerError,
  json,
  unauthorized,
} from '@/utils/apiResponse'
import { promises as fs } from 'fs'
import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function GET() {
  const user = await getServerUser()
  if (!user) return unauthorized()

  const file = await fs.readFile(process.cwd() + '/tmp/config.json', 'utf8')
  const data = JSON.parse(file)
  return json(data)
}

export async function PUT(req: NextRequest) {
  const user = await getServerUser()
  if (!user || user.role !== 'ADMIN') return unauthorized()

  const { data } = await req.json()
  if (!data) return badRequest()

  try {
    await fs.writeFile(
      process.cwd() + '/tmp/config.json',
      JSON.stringify(data, null, 2),
      'utf-8'
    )

    revalidatePath('/tasks/[id]', 'page')
    revalidatePath('/dashboard/general')
  } catch (error) {
    return internalServerError()
  }

  return json({ success: true })
}

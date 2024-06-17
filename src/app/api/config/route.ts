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
  try {
    const file = await fs.readFile(process.cwd() + '/tmp/config.json', 'utf8')
    const data = JSON.parse(file)

    return json({ config: data, status: 'OK' })
  } catch {
    return json({
      config: {
        languages: [
          {
            name: 'C',
            language: 'c',
            ext: 'c',
            compile: 'gcc --std=c11 -O2 {source_file} -o {output}',
            run: './{source}',
            available: true,
          },
          {
            name: 'C++',
            language: 'cpp',
            ext: 'cpp',
            compile: 'g++ --std=c++20 -O2 {source_file} -o {output}',
            run: './{source}',
            available: true,
          },
          {
            name: 'Python',
            language: 'python',
            ext: 'py',
            compile: 'python3 -m compileall {source_file} -b',
            run: '/usr/bin/python3 {source}.py',
            available: true,
          },
        ],
        auto_approve: true,
        result_interval: 5,
      },
      status: 'NULL',
    })
  }
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

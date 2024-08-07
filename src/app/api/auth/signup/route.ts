import { badRequest, internalServerError, json } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { username, name, className, password } = await req.json()
    if (!username || !name || !className || !password) return badRequest()

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    })
    if (existingUser) return badRequest('Username already exists')

    const hashedPassword = bcrypt.hashSync(password, 10)

    const config = await prisma.configuration.findUnique({
      where: {
        key: 'approval_required',
      },
    })

    const approval_required = config?.value || 'false'

    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        className,
        password: hashedPassword,
        approved: approval_required === 'false',
      },
    })

    return json({ success: true })
  } catch (error) {
    return internalServerError()
  }
}

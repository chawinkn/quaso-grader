import { badRequest, internalServerError, json } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prisma'
import { getConfig } from '@/utils/generalConfig'

export async function POST(req: NextRequest) {
  try {
    const { username, name, password } = await req.json()
    if (!username || !name || !password) return badRequest()

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    })
    if (existingUser) return badRequest('Username already exists')

    const hashedPassword = bcrypt.hashSync(password, 10)

    const config = getConfig()

    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        password: hashedPassword,
        approved: config.auto_approve,
      },
    })

    return json({ success: true })
  } catch (error) {
    return internalServerError()
  }
}

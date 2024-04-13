import { badRequest, internalServerError, json } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { username, inviteCode, password } = await req.json()
    if (!username || !inviteCode || !password) return badRequest()

    const invitation = await prisma.invitation.findUnique({
      where: {
        inviteCode,
      },
    })
    if (!invitation) return badRequest('Invalid invitation code')

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    })
    if (existingUser) return badRequest('Username already exists')

    const hashedPassword = bcrypt.hashSync(password, 10)
    const newUser = await prisma.user.create({
      data: {
        username,
        name: username,
        password: hashedPassword,
      },
    })

    return json({ success: true })
  } catch (error) {
    return internalServerError()
  }
}

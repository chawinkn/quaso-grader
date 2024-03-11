import { badRequest, internalServerError, json } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { username, inviteCode, password } = await request.json()
    if (!username || !inviteCode || !password) return badRequest()

    const group = await prisma.group.findUnique({
      where: {
        inviteCode,
      },
    })
    if (!group) return badRequest('Invalid invitation code')

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

    await prisma.group.update({
      where: {
        id: group.id,
      },
      data: {
        users: {
          connect: {
            id: newUser.id,
          },
        },
      },
    })

    return json({ success: true })
  } catch (error) {
    return internalServerError()
  }
}

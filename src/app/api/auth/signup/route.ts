import { badRequest, internalServerError, json } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prisma'
import { promises as fs } from 'fs'

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

    // 💀
    const file = await fs.readFile(process.cwd() + '/config.json', 'utf8')
    const config = JSON.parse(file)

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

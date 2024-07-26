import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function seed_root() {
  const hashedPassword = bcrypt.hashSync('root1234', 10)
  try {
    await prisma.user.create({
      data: {
        username: 'rootroot',
        name: 'rootroot',
        password: hashedPassword,
        role: 'ADMIN',
        approved: true,
      },
    })
    console.log('seed_root: Root created')
  } catch (err) {
    console.log('seed_root: Root already exists')
  }
}

async function seed_config() {
  const data = [
    {
      key: 'approval_required',
      value: 'false',
    },
    {
      key: 'available_language',
      value: 'c,cpp,python',
    },
    {
      key: 'result_interval',
      value: '2.5',
    },
  ]
  data.forEach(async (d) => {
    try {
      await prisma.configuration.create({
        data: {
          key: d.key,
          value: d.value,
        },
      })
      console.log(`seed_config: ${d.key} created`)
    } catch (err) {
      console.log(`seed_config: ${d.key} already exists`)
    }
  })
}

async function main() {
  await seed_root()
  await seed_config()
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

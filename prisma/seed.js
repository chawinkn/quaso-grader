const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcrypt')

let prisma, Prisma

async function seed_root() {
  const hashedPassword = bcrypt.hashSync('root1234', 10)
  const username = 'rootroot'
  try {
    await prisma.user.create({
      data: {
        username,
        name: username,
        password: hashedPassword,
        role: 'ADMIN',
        approved: true,
      },
    })
    console.log('seed_root: Root created')
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        console.log(`seed_root: ${username} already exists`)
      } else {
        console.error(
          `seed_root: Prisma error code ${err.code}: ${err.message}`
        )
      }
    } else {
      console.error(`seed_root: Unexpected error: ${err}`)
    }
  }
}

async function seed_config() {
  const data = [
    { key: 'approval_required', value: 'false' },
    { key: 'available_language', value: 'c,cpp,python' },
    { key: 'result_interval', value: '2.5' },
  ]

  for (const d of data) {
    try {
      await prisma.configuration.create({
        data: {
          key: d.key,
          value: d.value,
        },
      })
      console.log(`seed_config: ${d.key} created`)
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          console.log(`seed_config: ${d.key} already exists`)
        } else {
          console.error(
            `seed_root: Prisma error code ${err.code}: ${err.message}`
          )
        }
      } else {
        console.error(`seed_root: Unexpected error: ${err}`)
      }
    }
  }
}

async function main() {
  const client = await import('../src/generated/prisma/client.ts')
  Prisma = client.Prisma
  prisma = new client.PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  })
  await seed_root()
  await seed_config()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma?.$disconnect()
    process.exit(1)
  })

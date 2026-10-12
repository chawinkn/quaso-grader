import type { PrismaConfig } from 'prisma/config'

try {
  process.loadEnvFile()
} catch {}

export default {
  schema: 'prisma/schema.prisma',
  migrations: { seed: 'node prisma/seed.js' },
  datasource: { url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '' },
} satisfies PrismaConfig

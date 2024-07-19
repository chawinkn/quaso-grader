import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getServerUser } from '@/lib/session'
import UserPanel from '@/components/profile/UserPanel'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

async function getUser(userId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
    {
      method: 'GET',
      headers: new Headers(headers()),
    }
  )
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  if (!data) {
    return notFound()
  }
  return data
}

async function getPassList(userId: number) {
  const passList = await prisma.$queryRaw(
    Prisma.sql`
      SELECT 
        submission.task_id
      FROM 
        submission
      INNER JOIN 
        task ON submission.task_id = task.id 
      INNER JOIN
        "user" ON submission.user_id = "user".id
      WHERE 
        submission.score = task.full_score
        AND "user".id = ${userId}
      GROUP BY 
        submission.task_id`
  )
  return passList as Array<{ task_id: string }>
}

async function getScore(userId: number) {
  const score = (await prisma.$queryRaw(
    Prisma.sql`
      SELECT 
        SUM(max_score) as score
      FROM (
        SELECT 
          MAX(submission.score) as max_score
        FROM 
          submission 
        JOIN
          task ON submission.task_id = task.id
        WHERE 
          submission.user_id = ${userId}
          AND task.private = false
        GROUP BY 
          submission.task_id
      ) as max_scores_per_task
    `
  )) as Array<{ total_max_score: number }>

  const serialized = JSON.parse(
    JSON.stringify(score, (_, value) =>
      typeof value === 'bigint' ? Number(value) : value
    )
  ) as Array<{ score: number }>

  return serialized[0]?.score || 0
}

export default async function Profile({
  params,
}: {
  params: {
    id: string
  }
}) {
  if (isNaN(Number(params.id))) return notFound()
  const [User, user, passList, score, submissionsCount] = await Promise.all([
    getUser(Number(params.id)),
    getServerUser(),
    getPassList(Number(params.id)),
    getScore(Number(params.id)),
    prisma.submission.count({
      where: {
        userId: Number(params.id),
      },
    }),
  ])

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-57px)] py-10 space-y-6">
      <h1 className="text-3xl font-bold">PROFILE</h1>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">{User.username}</h1>
        {User.username === user?.name ? (
          <UserPanel {...User} />
        ) : (
          <p className="text-md">{User.name}</p>
        )}
        <div className="flex flex-row space-x-4 mt-6">
          <div className="bg-muted rounded-lg px-4 py-2 text-center">
            <p className="text-muted-foreground">Solved</p>
            <p className="text-2xl font-bold">{passList.length}</p>
          </div>
          <div className="bg-muted rounded-lg px-4 py-2 text-center">
            <p className="text-muted-foreground">Submissions</p>
            <p className="text-2xl font-bold">{submissionsCount}</p>
          </div>
          <div className="bg-muted rounded-lg px-4 py-2 text-center">
            <p className="text-muted-foreground">Score</p>
            <p className="text-2xl font-bold">{score}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col pt-4">
        <h1 className="text-xl font-medium text-center">
          List of solved problems
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {passList.map((pass) => (
            <Badge
              variant="outline"
              key={pass.task_id}
              className="h-10 text-sm font-normal"
            >
              <Link href={`/tasks/${pass.task_id}`} key={pass.task_id}>
                {pass.task_id}
              </Link>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

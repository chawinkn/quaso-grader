import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import ScoreboardTable from '@/components/scoreboard/ScoreboardTable'
import { ScoreboardData } from './columns'
import { columns } from './columns'
import { TableSkeleton } from '@/components/skeletons'
import { Suspense } from 'react'

async function getScoreBoard() {
  const scores = await prisma.$queryRaw(
    Prisma.sql`
      SELECT 
        submission.user_id as id, 
        "user".name, 
        "user".class_name,
        SUM(submission.max_score) as score
      FROM (
        SELECT 
          submission.user_id, 
          submission.task_id, 
          MAX(submission.score) as max_score 
        FROM 
          submission
        INNER JOIN 
          task ON submission.task_id = task.id
        INNER JOIN
          "user" ON submission.user_id = "user".id
        WHERE 
          task.private = false
          AND "user".approved = true
          AND "user".role != 'ADMIN'
        GROUP BY 
          submission.user_id, submission.task_id
      ) as submission
      INNER JOIN 
        "user" ON submission.user_id = "user".id
      GROUP BY 
        submission.user_id, "user".name, "user".class_name
      ORDER BY
        score DESC, "user".name ASC, "user".class_name ASC
    `
  )
  const serialized = JSON.parse(
    JSON.stringify(scores, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  ) as Array<{
    rank: number
    id: string
    name: string
    class_name: string
    passCount: number
    score: number
  }>

  return serialized.map(({ id, name, score, class_name }, index) => ({
    rank: index + 1,
    id,
    name,
    className: class_name,
    passCount: 0,
    score,
  }))
}

async function getTotalPassCount() {
  const passCounts = await prisma.$queryRaw(
    Prisma.sql`
      SELECT 
        "user".id as id,
        COUNT(DISTINCT submission.task_id) as count
      FROM 
        "user"
      LEFT JOIN 
        submission ON "user".id = submission.user_id
      LEFT JOIN 
        task ON submission.task_id = task.id
      WHERE 
        submission.score = task.full_score
        AND "user".approved = true
        AND "user".role != 'ADMIN'
      GROUP BY 
        "user".id
    `
  )

  const serialized = JSON.parse(
    JSON.stringify(passCounts, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  ) as Array<{ id: string; count: number }>

  return serialized.map(({ id, count }) => ({
    id,
    count,
  }))
}

async function ScoreTable() {
  const [scoreList, passCountList] = await Promise.all([
    getScoreBoard(),
    getTotalPassCount(),
  ])
  scoreList.map((user: ScoreboardData) => {
    const passCount = passCountList.find(
      (i: { id: string; count: number }) => i.id === user.id
    )
    user.passCount = passCount ? passCount.count : 0
  })

  return <ScoreboardTable columns={columns} data={scoreList} />
}

export default function Scoreboard() {
  return (
    <div className="min-h-[calc(100vh-57px)]">
      <div className="flex flex-col items-center justify-center py-10">
        <div className="mb-5 md:mb-8">
          <h1 className="text-3xl font-bold">SCOREBOARD</h1>
        </div>
        <Suspense fallback={<TableSkeleton row={5} column={4} />}>
          <ScoreTable />
        </Suspense>
      </div>
    </div>
  )
}

import TasksTable from '@/components/task/Taskstable'
import { TaskData, columns } from './columns'
import { headers } from 'next/headers'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'

async function getTaskList() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
    method: 'GET',
    headers: new Headers(headers()),
  })
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  return data
}

async function getScore() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/score`, {
    method: 'GET',
    headers: new Headers(headers()),
  })
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  return data
}

export async function getPassCount() {
  const passCount = await prisma.$queryRaw(
    Prisma.sql`
      SELECT 
        submission.task_id,
        COUNT(DISTINCT submission.user_id) 
      FROM 
        submission
      INNER JOIN 
        task ON submission.task_id = task.id 
      INNER JOIN
        "user" ON submission.user_id = "user".id
      WHERE 
        submission.score = task.full_score
        AND "user".approved = true
        AND "user".role != 'ADMIN'
      GROUP BY 
        submission.task_id`
  )
  const serialized = JSON.parse(
    JSON.stringify(passCount, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  ) as Array<{ task_id: string; count: number }>

  return serialized.map((i) => ({
    task_id: i.task_id,
    count: i.count,
  }))
}

export default async function Tasks() {
  const [taskList, scoreList, passCountList] = await Promise.all([
    getTaskList(),
    getScore(),
    getPassCount(),
  ])

  taskList.map((task: TaskData) => {
    const score = scoreList.find(
      (i: { task_id: string; max: number }) => i.task_id === task.id
    )
    task.score = score ? score.max : -1
    const passCount = passCountList.find(
      (i: { task_id: string; count: number }) => i.task_id === task.id
    )
    task.passCount = passCount ? passCount.count : 0
  })

  return (
    <div className="min-h-[calc(100vh-57px)]">
      <div className="flex flex-col items-center justify-center py-10">
        <div className="mb-5 md:mb-8">
          <h1 className="text-3xl font-bold">TASKS</h1>
        </div>
        <TasksTable columns={columns} data={taskList} />
      </div>
    </div>
  )
}

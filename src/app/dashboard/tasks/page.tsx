import { Suspense } from "react";
import { columns } from "./columns";
import TasksTable from "@/components/AdminTaskTable";
import { TaskData } from "./columns";
import { headers } from "next/headers";
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'

async function getTaskList() {
  // await new Promise((resolve) => setTimeout(resolve, 3000))
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
    method: 'GET',
    headers: new Headers(headers()),
  })
  if (!res) {
    return null
  }
  const data = await res.json()
  return data
}

async function getPassCount() {
  const passCount = await prisma.$queryRaw(
    Prisma.sql`
      SELECT 
        submission.task_id,
        COUNT(DISTINCT submission.user_id) 
      FROM 
        submission 
      INNER JOIN 
        task ON submission.task_id = task.id 
      WHERE 
        submission.score = task.full_score 
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

export default async function AdminTasks(){
  const [taskList, passCountList] = await Promise.all([
    getTaskList(),
    getPassCount(),
  ])

  taskList.map((task: TaskData) => {
    const passCount = passCountList.find(
      (i: { task_id: string; count: number }) => i.task_id === task.id
    )
    task.passCount = passCount ? passCount.count : 0
  })

    return (
        <div className="flex flex-col">
            <Suspense fallback={null}>
                <TasksTable columns={columns} data={taskList} />
            </Suspense>
        </div>
    )
}
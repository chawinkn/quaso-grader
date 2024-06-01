import { Suspense } from 'react'
import { columns } from './columns'
import TasksTable from '@/components/admin/AdminTaskTable'
import { TaskData } from './columns'
import { headers } from 'next/headers'
import { getPassCount } from '@/app/tasks/page'

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

export default async function AdminTasks() {
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

import { Suspense } from 'react'
import { columns } from './columns'
import TasksTable from '@/components/admin/AdminTaskTable'
import { TaskData } from './columns'
import { headers } from 'next/headers'
import { getPassCount } from '@/app/tasks/page'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { TableSkeleton } from '@/components/skeletons'

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

async function TaskTable() {
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

  return <TasksTable columns={columns} data={taskList} />
}

export default function AdminTasks() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center mb-6">
        <Link href={'/dashboard/tasks/create'}>
          <Button>Create Task</Button>
        </Link>
      </div>
      <Suspense fallback={<TableSkeleton row={5} column={6} />}>
        <TaskTable />
      </Suspense>
    </div>
  )
}

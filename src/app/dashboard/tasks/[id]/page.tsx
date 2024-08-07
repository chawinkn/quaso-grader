import { Suspense } from 'react'
import { columns } from './columns'
import TasksTable from '@/components/admin/AdminTaskTable'
import { TaskData } from './columns'
import { headers } from 'next/headers'
import { getPassCount } from '@/app/tasks/page'
import { TableSkeleton } from '@/components/skeletons'
import { notFound } from 'next/navigation'

export async function getGroup(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${id}`, {
    method: 'GET',
    headers: new Headers(headers()),
  })
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  if (!data) {
    return notFound()
  }
  return data
}

async function getTaskList(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/groups/${id}`,
    {
      method: 'GET',
      headers: new Headers(headers()),
    }
  )
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  return data
}

async function TaskTable({ id }: { id: string }) {
  await getGroup(id)

  const [taskList, passCountList] = await Promise.all([
    getTaskList(id),
    getPassCount(),
  ])

  taskList.map((task: TaskData) => {
    const passCount = passCountList.find(
      (i: { task_id: string; count: number }) => i.task_id === task.id
    )
    task.passCount = passCount ? passCount.count : 0
  })

  return <TasksTable columns={columns} data={taskList} id={id} />
}

export default function AdminTasks({
  params,
}: {
  params: {
    id: string
  }
}) {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<TableSkeleton row={5} column={6} />}>
        <TaskTable id={params.id} />
      </Suspense>
    </div>
  )
}

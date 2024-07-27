import { notFound } from 'next/navigation'
import TaskLayout from '@/components/task/Tasklayout'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { getConfig } from '@/app/dashboard/general/page'
import { TaskLayoutSkeleton } from '@/components/skeletons'

async function getTask(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
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

async function TaskLayoutComponent({ id }: { id: string }) {
  const [task, available_languageValues] = await Promise.all([
    getTask(id),
    getConfig('available_language'),
  ])
  const available_language = {
    available_language: available_languageValues?.value || 'c,cpp,python',
  }

  return <TaskLayout task={task} config={available_language} />
}

export default function Task({
  params,
}: {
  params: {
    id: string
  }
}) {
  return (
    <div className="min-h-[calc(100vh-57px)] flex">
      <Suspense fallback={<TaskLayoutSkeleton />}>
        <TaskLayoutComponent id={params.id} />
      </Suspense>
    </div>
  )
}

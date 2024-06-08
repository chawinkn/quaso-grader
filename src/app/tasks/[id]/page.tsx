import { notFound } from 'next/navigation'
import TaskLayout from '@/components/task/Tasklayout'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { getConfig } from '@/app/dashboard/general/page'

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

export default async function Task({
  params,
}: {
  params: {
    id: string
  }
}) {
  const task = await getTask(params.id)
  const { config, status } = await getConfig()

  return (
    <div className="min-h-screen flex">
      <Suspense fallback={null}>
        <TaskLayout task={task} config={config} />
      </Suspense>
    </div>
  )
}

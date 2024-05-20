import { notFound } from 'next/navigation'
import TaskLayout from '@/components/Tasklayout'
import { Suspense } from 'react'
import { headers } from 'next/headers'

async function getTask(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
    method: 'GET',
    headers: new Headers(headers()),
  })
  if (!res) {
    return notFound()
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

  return (
    <div className="min-h-screen flex">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center h-screen py-10">
            <p className="text-base animate-pulse">Loading...</p>
          </div>
        }
      >
        <TaskLayout task={task} />
      </Suspense>
    </div>
  )
}

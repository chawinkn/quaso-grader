import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import EditTaskLayout from '@/components/admin/AdminEditTask'

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

export default async function EditTask({
  params,
}: {
  params: {
    id: string
  }
}) {
  const task = await getTask(params.id)

  return (
    <div className="min-h-screen flex">
      <Suspense fallback={null}>
        <EditTaskLayout task={task} />
      </Suspense>
    </div>
  )
}

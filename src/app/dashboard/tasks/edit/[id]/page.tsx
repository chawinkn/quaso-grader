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

async function getManifest(id: string) {
  const null_manifest = {
    time_limit: '0',
    memory_limit: '0',
    checker: 'lcmp',
    skip: false,
    full_score: '0',
    num_testcases: '0',
    subtasks: [],
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/manifest/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (!res.ok) {
      return { manifest: null_manifest, status: 'NULL' }
    }
    const data = await res.json()
    return { manifest: data, status: 'OK' }
  } catch {
    return { manifest: null_manifest, status: 'NULL' }
  }
}

export default async function EditTask({
  params,
}: {
  params: {
    id: string
  }
}) {
  const task = await getTask(params.id)
  const { manifest, status } = await getManifest(params.id)

  return (
    <div className="min-h-screen flex flex-col space-y-4">
      <Suspense fallback={null}>
        <EditTaskLayout task={task} manifest={manifest} status={status} />
      </Suspense>
    </div>
  )
}

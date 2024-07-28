import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import EditTaskLayout from '@/components/admin/AdminEditTask'
import { EditTaskSkeleton } from '@/components/skeletons'

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

async function EditTaskComponent({ id }: { id: string }) {
  const [task, manifest] = await Promise.all([getTask(id), getManifest(id)])

  return (
    <EditTaskLayout
      task={task}
      manifest={manifest.manifest}
      status={manifest.status}
    />
  )
}

export default function EditTask({
  params,
}: {
  params: {
    id: string
  }
}) {
  return (
    <div className="min-h-[calc(100vh-57px)] flex flex-col space-y-4">
      <Suspense fallback={<EditTaskSkeleton />}>
        <EditTaskComponent id={params.id} />
      </Suspense>
    </div>
  )
}

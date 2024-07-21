import { Suspense } from 'react'
import SubmissionLayout from '@/components/submission/Submissionslayout'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { getConfig } from '@/utils/generalConfig'

async function getSubmission(submissionId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}`,
    {
      method: 'GET',
      headers: new Headers(headers()),
    }
  )
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  if (!data) {
    return notFound()
  }
  return data
}

async function getUser(userId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
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

async function getTask(taskId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
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

export default async function Submission({
  params,
}: {
  params: {
    id: string
  }
}) {
  const submission = await getSubmission(params.id)

  const config = getConfig()

  const [User, Task] = await Promise.all([
    getUser(submission.userId),
    getTask(submission.taskId),
  ])

  return (
    <div className="min-h-[calc(100vh-57px)] py-10 space-y-4">
      <Suspense fallback={null}>
        <SubmissionLayout
          id={params.id}
          config={config}
          username={User.username}
          userId={User.id}
          task={{ title: Task.title, fullScore: Task.fullScore }}
        />
      </Suspense>
    </div>
  )
}

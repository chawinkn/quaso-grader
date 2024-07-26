import { Suspense } from 'react'
import SubmissionLayout from '@/components/submission/Submissionslayout'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { getConfig } from '@/app/dashboard/general/page'
import { SubmissionLayoutSkeleton } from '@/components/skeletons'

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

async function SubmissionLayoutComponent({ id }: { id: string }) {
  const [submission, result_intervalValues] = await Promise.all([
    getSubmission(id),
    getConfig('result_interval'),
  ])
  const result_interval = {
    result_interval: result_intervalValues?.value || '2.5',
  }
  const [User, Task] = await Promise.all([
    getUser(submission.userId),
    getTask(submission.taskId),
  ])

  return (
    <SubmissionLayout
      id={id}
      config={result_interval}
      username={User.username}
      userId={User.id}
      task={{ title: Task.title, fullScore: Task.fullScore }}
    />
  )
}

export default function Submission({
  params,
}: {
  params: {
    id: string
  }
}) {
  return (
    <div className="min-h-[calc(100vh-57px)] py-10 space-y-4">
      <Suspense fallback={<SubmissionLayoutSkeleton />}>
        <SubmissionLayoutComponent id={params.id} />
      </Suspense>
    </div>
  )
}

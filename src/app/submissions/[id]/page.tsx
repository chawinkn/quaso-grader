import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import SubmissionLayout from '@/components/Submissionslayout'

async function getSubmission(submissionId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}`,
    {
      method: 'GET',
      headers: new Headers(headers()),
    }
  )
  if (!res) {
    return notFound()
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
  if (!res) {
    return notFound()
  }
  const data = await res.json()
  if (!data) {
    return notFound()
  }
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
  if (!res) {
    return notFound()
  }
  const data = await res.json()
  if (!data) {
    return notFound()
  }
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
  const User = await getUser(submission.userId)
  const Task = await getTask(submission.taskId)
  submission.username = User.username
  submission.taskTitle = Task.title

  return (
    <div className="min-h-screen">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-base animate-pulse">Loading...</p>
          </div>
        }
      >
        <SubmissionLayout submission={submission} />
      </Suspense>
    </div>
  )
}

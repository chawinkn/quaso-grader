import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import SubmissionLayout from '@/components/Submissionslayout'

async function getSubmission(submissionId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}`,
    {
      method: 'GET',
      headers: new Headers(headers()),
    }
  )
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
  const data = await res.json()
  if (!data) {
    return notFound()
  }
  return data
}

async function getTask(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
    method: 'GET',
    headers: new Headers(headers()),
  })
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
  if (isNaN(Number(params.id))) return notFound()
  const submission = await getSubmission(Number(params.id))
  const User = await getUser(submission.userId)
  const Task = await getTask(submission.taskId)
  submission.username = User.username
  submission.taskTitle = Task.title

  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-screen py-10">
          <p className="text-base animate-pulse">Loading...</p>
        </div>
      }
    >
      <SubmissionLayout submission={submission} />
    </Suspense>
  )
}

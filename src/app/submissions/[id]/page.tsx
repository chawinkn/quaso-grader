import { Suspense } from 'react'
import { headers } from 'next/headers'
import SubmissionLayout from '@/components/Submissionslayout'
import { notFound } from 'next/navigation'

async function getSubmission(submissionId: string) {
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
  const [User, Task] = await Promise.all([
    getUser(submission.userId),
    getTask(submission.taskId),
  ])
  submission.username = User.username
  submission.taskTitle = Task.title

  return (
    <div className="min-h-screen">
      <Suspense fallback={null}>
        <SubmissionLayout submission={submission} />
      </Suspense>
    </div>
  )
}

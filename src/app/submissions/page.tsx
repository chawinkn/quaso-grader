import { columns } from './columns'
import { Suspense } from 'react'
import SubmissionsTable from '@/components/Submissionstable'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

async function getSubmissionList() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions`, {
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

export default async function Submissions() {
  const submissionList = await getSubmissionList()

  for (const submission of submissionList) {
    const User = await getUser(submission.userId)
    submission.username = User.username
  }

  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center py-10">
        <div className="mb-5 md:mb-8">
          <h1 className="text-3xl font-bold">SUBMISSIONS</h1>
        </div>
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center h-screen py-10">
              <p className="text-base animate-pulse">Loading...</p>
            </div>
          }
        >
          <SubmissionsTable columns={columns} data={submissionList} />
        </Suspense>
      </div>
    </div>
  )
}

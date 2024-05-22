import { columns } from './columns'
import { Suspense } from 'react'
import SubmissionsTable from '@/components/Submissionstable'
import { headers } from 'next/headers'

async function getSubmissionList() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions`, {
    method: 'GET',
    headers: new Headers(headers()),
  })
  const data = await res.json()
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
        <Suspense fallback={null}>
          <SubmissionsTable columns={columns} data={submissionList} />
        </Suspense>
      </div>
    </div>
  )
}

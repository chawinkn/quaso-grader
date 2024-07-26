import { columns } from './columns'
import { Suspense } from 'react'
import SubmissionsTable from '@/components/submission/Submissionstable'
import { headers } from 'next/headers'
import { getServerUser } from '@/lib/session'
import { TableSkeleton } from '@/components/skeletons'

async function getSubmissionList() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions`, {
    method: 'GET',
    headers: new Headers(headers()),
  })
  if (!res.ok) {
    return null
  }
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
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  return data
}

async function SubmissionTable() {
  const [submissionList, User] = await Promise.all([
    getSubmissionList(),
    getServerUser(),
  ])
  const user = await getUser(User?.id)

  return (
    <SubmissionsTable
      columns={columns}
      data={submissionList}
      username={user?.name}
      role={User?.role}
    />
  )
}

export default function Submissions() {
  return (
    <div className="min-h-[calc(100vh-57px)]">
      <div className="flex flex-col items-center justify-center py-10">
        <div className="mb-5 md:mb-8">
          <h1 className="text-3xl font-bold">SUBMISSIONS</h1>
        </div>
        <Suspense fallback={<TableSkeleton row={5} column={5} />}>
          <SubmissionTable />
        </Suspense>
      </div>
    </div>
  )
}

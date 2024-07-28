import { columns, SubmissionData } from '../columns'
import { Suspense } from 'react'
import SubmissionsTable from '@/components/submission/Submissionstable'
import { headers } from 'next/headers'
import { getServerUser } from '@/lib/session'
import { TableSkeleton } from '@/components/skeletons'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import PaginationControls, {
  PerPageControls,
} from '@/components/PaginationControls'
import { notFound } from 'next/navigation'

async function getSubmission({
  start,
  per_page,
  User,
}: {
  start: number
  per_page: number
  User: { id: number; name: string; role: string } | null
}): Promise<SubmissionData[]> {
  const res = await prisma.submission.findMany({
    where: User?.role !== 'ADMIN' ? { task: { private: false } } : {},
    orderBy: {
      id: 'desc',
    },
    select: {
      taskId: true,
      id: true,
      score: true,
      user: {
        select: {
          name: true,
          id: true,
        },
      },
      language: true,
      time: true,
      memory: true,
      submittedAt: true,
      status: true,
      task: {
        select: {
          fullScore: true,
        },
      },
    },
    skip: start,
    take: per_page,
  })

  return res
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

async function SubmissionTable({
  start,
  end,
  per_page,
}: {
  start: number
  end: number
  per_page: number
}) {
  const User = await getServerUser()
  const pageCount = await prisma.submission.count({
    where: User?.role !== 'ADMIN' ? { task: { private: false } } : {},
  })
  if (start > pageCount) {
    return notFound()
  }
  const submissionList = await getSubmission({
    start,
    per_page,
    User: User ?? null,
  })
  const user = await getUser(User?.id)

  return (
    <>
      {User ? (
        <div className="flex justify-center mb-5 space-x-4">
          <Link href={'/submissions'}>
            <Button variant={'outline'}>My submissions</Button>
          </Link>
          <Link href={'/submissions/all'}>
            <Button variant={'secondary'}>All submissions</Button>
          </Link>
        </div>
      ) : (
        <></>
      )}
      <SubmissionsTable
        columns={columns}
        data={submissionList}
        username={user?.name}
        role={User?.role}
      />
      <div className="flex items-center mt-4 space-x-6 lg:space-x-8">
        <PerPageControls path={'/submissions/all'} />
        <PaginationControls
          path={'/submissions/all'}
          hasNextPage={end < pageCount}
          hasPrevPage={start > 0}
          pageCount={Math.ceil(pageCount / per_page)}
        />
      </div>
    </>
  )
}

export default function AllSubmissions({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}) {
  const pageParam = searchParams['page'] ?? '1'
  const perPageParam = searchParams['per_page'] ?? '10'

  const page = Number(pageParam)
  const per_page = Number(perPageParam)

  if (isNaN(page) || isNaN(per_page) || page < 1 || per_page < 1) {
    return notFound()
  }
  if (![10, 20, 30, 40, 50].includes(per_page)) {
    return notFound()
  }

  const start = (page - 1) * per_page
  const end = start + per_page

  return (
    <div className="min-h-[calc(100vh-57px)]">
      <div className="flex flex-col items-center justify-center py-10">
        <div className="mb-5">
          <h1 className="text-3xl font-bold">SUBMISSIONS</h1>
        </div>
        <Suspense fallback={<TableSkeleton row={5} column={5} />}>
          <SubmissionTable
            start={start}
            end={end}
            per_page={Number(per_page)}
          />
        </Suspense>
      </div>
    </div>
  )
}

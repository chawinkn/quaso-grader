import { Suspense } from 'react'
import SubmissionLayout from '@/components/submission/Submissionslayout'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'

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

export default async function Submission({
  params,
}: {
  params: {
    id: string
  }
}) {
  await getSubmission(params.id)

  return (
    <div className="min-h-screen py-10 space-y-4">
      <Suspense fallback={null}>
        <SubmissionLayout id={params.id} />
      </Suspense>
    </div>
  )
}

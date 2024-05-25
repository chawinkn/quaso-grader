'use client'

import { Suspense } from 'react'
import SubmissionLayout from '@/components/Submissionslayout'
import { notFound } from 'next/navigation'
import Resultlayout from '@/components/Resultlayout'

async function getSubmission(submissionId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}`,
    {
      method: 'GET',
    }
  )
  if (!res) {
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
      <Suspense fallback={null}>
        <Resultlayout id={params.id} />
      </Suspense>
    </div>
  )
}

import { Suspense } from 'react'
import SubmissionLayout from '@/components/submission/Submissionslayout'
import { notFound } from 'next/navigation'
import Resultlayout from '@/components/result/Resultlayout'

export default async function Submission({
  params,
}: {
  params: {
    id: string
  }
}) {
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

'use client'

import ResultsTable from '@/components/result/Resultstable'
import { columns, ResultData } from '@/app/submissions/[id]/columns'
import { useEffect, useState } from 'react'

async function getSubmission(submissionId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}`,
    {
      method: 'GET',
    }
  )
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  return data
}

export default function Resultlayout({ id }: { id: string }) {
  const [status, setStatus] = useState('')
  const [data, setData] = useState<Array<ResultData>>([])

  const fetchSubmission = async () => {
    const submission = await getSubmission(id)
    if (submission) {
      setData(submission.result)
      setStatus(submission.status)
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    const startFetching = async () => {
      await fetchSubmission()
      if (status === 'Pending' || status === 'Judging') {
        interval = setInterval(fetchSubmission, 1000 * 5)
      }
    }

    startFetching()

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [id, status])

  return (
    <ResultsTable columns={columns} data={data} />
  ) 
}

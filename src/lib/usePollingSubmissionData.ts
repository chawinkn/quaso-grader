import useSWR from 'swr'

interface IGeneralSubmission {
  id: number
  taskTitle: string
  taskId: string
  submittedAt: string
  status: string
  time: number
  memory: number
  code: string
  fullScore: number
  score: number
  result: Array<Object>
  language: string
  username: string
}

const fetcher = async (url: string): Promise<IGeneralSubmission> => {
  const res = await fetch(url)
  return res.json()
}

const usePollingSubmissionData = (id: string, result_interval: number) => {
  const { data, error, mutate } = useSWR<IGeneralSubmission>(
    `/api/submissions/${id}`,
    fetcher,
    {
      refreshInterval: (data) => {
        if (data) {
          if (
            data.status === 'Completed' ||
            data.status === 'Compilation Error'
          ) {
            return 0
          }
        }
        return result_interval * 1000
      },
    }
  )

  return {
    submission: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export default usePollingSubmissionData

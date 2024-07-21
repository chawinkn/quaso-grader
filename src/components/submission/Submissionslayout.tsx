'use client'

import Editor from '@monaco-editor/react'
import { Card } from '../ui/card'
import Link from 'next/link'
import { cx } from 'class-variance-authority'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Config } from '../admin/AdminGeneralPanel'
import usePollingSubmissionData from '@/lib/usePollingSubmissionData'
import Loading from '@/app/loading'
import ResultsTable from '../result/Resultstable'
import { columns, ResultData } from '@/app/submissions/[id]/columns'

export type SubmissionData = {
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

export default function SubmissionLayout({
  id,
  config,
  username,
  userId,
  task,
}: {
  id: string
  config: Config
  username: string
  userId: number
  task: {
    title: string
    fullScore: number
  }
}) {
  const { submission, isLoading } = usePollingSubmissionData(id)

  if (isLoading || !submission) {
    return <Loading />
  }

  submission.taskTitle = task.title
  submission.fullScore = task.fullScore
  submission.username = username

  const languageList: Array<{ name: string; language: string; ext: string }> =
    config.languages.map((i) => {
      return { name: i.name, language: i.language, ext: i.ext }
    })
  const findLanguage = languageList.filter(
    (lang) => lang.language === submission.language
  )
  const displayLanguage = findLanguage[0].name
  const submissionDate = new Date(submission.submittedAt)

  let style = 'bg-yellow-500 dark:bg-yellow-900'

  const result: Array<ResultData> = submission.result as Array<ResultData>

  if (submission.status === 'Completed') {
    style = 'bg-green-500 dark:bg-green-900'
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold">Submission #{submission.id}</h2>
      <div className="flex flex-col items-center justify-center my-5 w-10/12 lg:w-[950px] ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Memory</TableHead>
              <TableHead>User</TableHead>
              <TableHead>At</TableHead>
              <TableHead>Language</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Link
                  className="hover:underline"
                  href={`/tasks/${submission.taskId}`}
                >
                  {submission.taskTitle}
                </Link>
              </TableCell>
              <TableCell>
                <div
                  className={cx(
                    'px-2.5 py-0.5 rounded text-white font-medium w-fit',
                    style
                  )}
                >
                  {submission.status}
                </div>
              </TableCell>
              <TableCell>{submission.time} ms</TableCell>
              <TableCell>{submission.memory} KB</TableCell>
              <TableCell>
                <Link
                  className="hover:underline"
                  href={`/profile/${userId}`}
                  target="_blank"
                >
                  {submission.username}
                </Link>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {submissionDate.toLocaleDateString()}
                    </TooltipTrigger>
                    <TooltipContent>
                      {submissionDate.toLocaleTimeString()}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{displayLanguage}</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>
                <div className="flex flex-col md:items-center">
                  <div className="w-[270px] md:w-[350px] lg:w-[650px]">
                    <p className="text-base text-center">
                      Score: {submission.score}/{submission.fullScore}
                    </p>
                    <Progress
                      value={submission.score}
                      max={submission.fullScore}
                      className="transition-all duration-300 ease-in-out border hover:border-2"
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <ResultsTable columns={columns} data={result} />
      <div className="flex flex-col items-center w-full mt-4">
        <Card className="w-10/12 lg:w-[950px] h-[600px] overflow-hidden">
          <Editor
            language={submission.language}
            value={submission.code}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              fontLigatures: true,
              readOnly: true,
            }}
            className="caret-transparent monaco-font"
          />
        </Card>
      </div>
    </div>
  )
}

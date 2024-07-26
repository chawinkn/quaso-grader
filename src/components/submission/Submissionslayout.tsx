'use client'

import { Card } from '../ui/card'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
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
import usePollingSubmissionData from '@/lib/usePollingSubmissionData'
import Loading from '@/app/loading'
import ResultsTable from '../result/Resultstable'
import { columns, ResultData } from '@/app/submissions/[id]/columns'
import { Highlight, themes } from 'prism-react-renderer'
import { cn } from '@/lib/utils'
import styles from '@/components/HighlightWithLineNumbers.module.css'
import { Copy } from 'lucide-react'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'
import { languages } from '@/utils/generalConfig'

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
  config: { result_interval: string }
  username: string
  userId: number
  task: {
    title: string
    fullScore: number
  }
}) {
  const { submission, isLoading } = usePollingSubmissionData(
    id,
    Number(config.result_interval)
  )

  if (isLoading || !submission) {
    return <Loading />
  }

  submission.taskTitle = task.title
  submission.fullScore = task.fullScore
  submission.username = username

  const languagesItems: Array<{ id: string; label: string }> = languages.map(
    (i) => {
      return { id: i.language, label: i.name }
    }
  )
  const displayLanguage =
    languagesItems.find((lang) => lang.id === submission.language)?.label || ''
  const submissionDate = new Date(submission.submittedAt)

  let style = 'bg-yellow-500 dark:bg-yellow-900'

  const result: Array<ResultData> = submission.result as Array<ResultData>

  if (submission.status === 'Completed') {
    style = 'bg-green-500 dark:bg-green-900'
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(submission.code)
      toast.success('Code copied to clipboard')
    } catch {
      toast.error('Failed to copy code to clipboard')
    }
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
                  className={cn(
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
                      Score: {submission.score} / {submission.fullScore}
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
        <Card className="relative w-10/12 lg:w-[950px] overflow-hidden monaco-font">
          <Button
            variant="secondary"
            size="icon"
            className="absolute border-0 top-2 right-2"
            onClick={handleCopy}
          >
            <Copy size={20} />
            <span className="sr-only">Copy code</span>
          </Button>
          <Highlight
            theme={themes.vsDark}
            code={submission.code}
            language={submission.language}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                style={{ ...style, tabSize: 4 }}
                className={cn(
                  className,
                  'overflow-x-auto rounded-md monaco-font caret-transparent',
                  styles.pre
                )}
              >
                {tokens.map((line, i) => (
                  <div
                    {...getLineProps({ line, key: i })}
                    key={i}
                    className={styles.line}
                  >
                    <span className={styles.lineNo}>{i + 1}</span>
                    <span className={styles.lineContent}>
                      {line.map((token, key) => (
                        <span {...getTokenProps({ token, key })} key={key} />
                      ))}
                    </span>
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </Card>
      </div>
    </div>
  )
}

'use client'

import Editor from '@monaco-editor/react'
import { Card } from './ui/card'
import Link from 'next/link'

type SubmissionData = {
  id: number
  taskTitle: string
  taskId: string
  submittedAt: string
  time: number
  memory: number
  code: string
  score: number
  result: Array<Object>
  language: string
  username: string
}

export default function SubmissionLayout({ ...props }) {
  const submission: SubmissionData = props?.submission
  const languageList = [
    {
      name: 'C',
      language: 'c',
      ext: 'c',
    },
    {
      name: 'C++',
      language: 'cpp',
      ext: 'cpp',
    },
    {
      name: 'Python',
      language: 'python',
      ext: 'py',
    },
  ]
  const findLanguage = languageList.filter(
    (lang) => lang.language === submission.language
  )
  const displayLanguage = findLanguage[0].name

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <p className="font-bold">Submission: {submission.id}</p>
      <div className="inline">
        <p className="inline font-bold">Task: </p>
        <Link
          href={`/tasks/${submission.taskId}`}
          className="hover:underline inline"
        >
          [{submission.taskTitle}]
        </Link>
      </div>
      <div className="inline">
        <p className="inline font-bold">User : </p>
        <p className="inline">{submission.username} </p>
        <p className="inline font-bold">Language : </p>
        <p className="inline">{displayLanguage}</p>
      </div>
      <div className="inline">
        <p className="inline font-bold">Score : </p>
        <p className="inline">{submission.score} </p>
        <p className="inline font-bold">Time : </p>
        <p className="inline">{submission.time} ms </p>
        <p className="inline font-bold">Memory : </p>
        <p className="inline">{submission.memory} kB</p>
      </div>
      <div className="flex flex-col mt-5 space-y-4 lg:flex-row sm:space-x-4">
        <Card className="w-[350px] sm:w-[500px] xl:w-[700px] h-[400px] overflow-hidden">
          <Editor
            language={submission.language}
            value={submission.code}
            theme="vs-dark"
            height="75vh"
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              readOnly: true,
            }}
            className="caret-transparent"
          />
        </Card>
      </div>
    </div>
  )
}

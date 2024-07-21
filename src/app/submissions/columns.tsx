'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cx } from 'class-variance-authority'
import Link from 'next/link'

export type SubmissionData = {
  id: number
  taskId: string
  user: {
    name: string
    id: number
  }
  task: {
    fullScore: number
  }
  status: string
  score: number
  submittedAt: string
  language: string
  time: number
  memory: number
}

export function formatDateTime(dateTimeString: string) {
  const date = new Date(dateTimeString)

  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const formattedDate = `${day} ${monthNames[month]} ${year}`

  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  const formattedTime = `${hours}:${minutes}`

  return { formattedDate, formattedTime }
}

export const columns: ColumnDef<SubmissionData>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <div>
          <span className="flex items-center">
            ID
            <Button
              variant="ghost"
              size="icon"
              className="border-0"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() == 'asc')
              }}
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'submittedAt',
    header: ({ column }) => {
      return (
        <div className="hidden sm:flex">
          <span className="flex items-center">
            Time
            <Button
              variant="ghost"
              size="icon"
              className="border-0"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() == 'asc')
              }}
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </span>
        </div>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="hidden sm:flex">
          {formatDateTime(row.getValue('submittedAt')).formattedDate}
          <br />
          {formatDateTime(row.getValue('submittedAt')).formattedTime}
        </div>
      )
    },
  },
  {
    accessorKey: 'user',
    header: ({ column }) => {
      return (
        <div>
          <span className="flex items-center">
            Name
            <Button
              variant="ghost"
              size="icon"
              className="border-0"
              onClick={() =>
                column.toggleSorting(
                  column.getIsSorted() === 'asc' || !column.getIsSorted()
                )
              }
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </span>
        </div>
      )
    },
    accessorFn: (row: SubmissionData, index: number) => {
      return (
        <Link
          className="hover:underline"
          href={`/profile/${row.user.id}`}
          target="_blank"
        >
          {row.user.name}
        </Link>
      )
    },
    cell: ({ row }) => {
      return row.getValue('user')
    },
  },
  {
    accessorKey: 'taskId',
    header: ({ column }) => {
      return (
        <div>
          <span className="flex items-center">
            Task
            <Button
              variant="ghost"
              size="icon"
              className="border-0"
              onClick={() =>
                column.toggleSorting(
                  column.getIsSorted() === 'asc' || !column.getIsSorted()
                )
              }
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'score',
    header: ({ column }) => {
      return (
        <div>
          <span className="flex items-center">
            Score
            <Button
              variant="ghost"
              size="icon"
              className="border-0"
              onClick={() =>
                column.toggleSorting(
                  column.getIsSorted() === 'asc' || !column.getIsSorted()
                )
              }
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </span>
        </div>
      )
    },
    accessorFn: (row: SubmissionData, index: number) => {
      let style = 'bg-yellow-500 dark:bg-yellow-900'
      let score = row.score
      let fullScore = row.task.fullScore

      if (score === fullScore) {
        style = 'bg-green-500 dark:bg-green-900'
      } else if (score === -1) {
        score = 0
        style = 'bg-primary dark:bg-muted/90'
      }
      return (
        <div
          className={cx(
            'px-2.5 py-0.5 rounded text-white font-medium w-fit',
            style
          )}
        >
          <span>{score}</span>
          <span className="hidden sm:inline"> / {fullScore}</span>
        </div>
      )
    },
    cell: ({ row }) => {
      return row.getValue('score')
    },
  },
]

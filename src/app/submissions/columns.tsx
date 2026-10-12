'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Features } from '@/lib/table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export type SubmissionData = {
  id: number
  taskId: string
  user: {
    name: string | null
    id: number | null
  } | null
  task: {
    fullScore: number
  }
  status: string
  score: number
  submittedAt: Date
  language: string
  time: number
  memory: number
}

export const columns: ColumnDef<Features, SubmissionData>[] = [
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
      const submissionDate = new Date(row.getValue('submittedAt'))

      return (
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
        // <div className="hidden sm:flex">
        //   {formatDateTime(row.getValue('submittedAt')).formattedDate}
        //   <br />
        //   {formatDateTime(row.getValue('submittedAt')).formattedTime}
        // </div>
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
    accessorFn: (row: SubmissionData, index: number) => row.user?.name,
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <Link
          className="hover:underline"
          href={`/profile/${user?.id}`}
          target="_blank"
        >
          {user?.name}
        </Link>
      )
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
    cell: ({ row }) => {
      const taskId = row.getValue('taskId') as string
      return (
        <Link
          className="hover:underline"
          href={`/tasks/${taskId}`}
          target="_blank"
        >
          {taskId}
        </Link>
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
    cell: ({ row }) => {
      let style = 'bg-yellow-500 dark:bg-yellow-900'
      let score = row.getValue('score')
      let fullScore = row.original.task.fullScore

      if (score === fullScore) {
        style = 'bg-green-500 dark:bg-green-900'
      } else if (score === -1) {
        score = 0
        style = 'bg-primary dark:bg-muted'
      }
      return (
        <div
          className={cn(
            'px-2.5 py-0.5 rounded text-white font-medium w-fit',
            style
          )}
        >
          <span>{String(score)}</span>
          <span className="hidden sm:inline"> / {fullScore}</span>
        </div>
      )
    },
  },
]

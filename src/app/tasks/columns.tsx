'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type TaskData = {
  id: string
  title: string
  fullScore: number
  private: boolean
  passCount: number
  score: number
}

export const columns: ColumnDef<TaskData>[] = [
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
                column.toggleSorting(column.getIsSorted() !== 'desc')
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
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <div>
          <span className="flex items-center">
            Title
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
    accessorKey: 'passCount',
    header: ({ column }) => {
      return (
        <div className="hidden sm:flex">
          <span className="flex items-center">
            Passed
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
      return <div className="hidden sm:flex">{row.getValue('passCount')}</div>
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
    accessorFn: (row: TaskData, index: number) => {
      let style = 'bg-yellow-500 dark:bg-yellow-900'
      let score = row.score
      let fullScore = row.fullScore

      if (score === fullScore) {
        style = 'bg-green-500 dark:bg-green-900'
      } else if (score === -1) {
        score = 0
        style = 'bg-primary dark:bg-muted/90'
      }
      return (
        <div
          className={cn(
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

'use client'

import { ColumnDef } from '@tanstack/react-table'
import { cx } from 'class-variance-authority'

export type ResultData = {
  time: number
  score: number
  memory: number
  status: string
  test_index: number
  subtask_index: number
}

export const columns: ColumnDef<ResultData>[] = [
  {
    accessorKey: 'test_index',
    header: 'ID',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      let style = 'bg-yellow-500 dark:bg-yellow-900'
      const status: string = row.getValue('status')

      if (status === 'Accepted') {
        style = 'bg-green-500 dark:bg-green-900'
      } else if (status === 'Wrong Answer') {
        style = 'bg-red-500 dark:bg-red-900'
      }

      return (
        <div
          className={cx(
            'px-2.5 py-0.5 rounded text-white font-medium w-fit',
            style
          )}
        >
          {status}
        </div>
      )
    },
  },
  {
    accessorKey: 'time',
    header: 'Time',
    cell: ({ row }) => {
      return <div>{(row.getValue('time') as number) * 1000} ms</div>
    },
  },
  {
    accessorKey: 'memory',
    header: 'Memory',
    cell: ({ row }) => {
      return <div>{row.getValue('memory')} KB</div>
    },
  },
  {
    accessorKey: 'score',
    header: 'Score',
  },
  {
    accessorKey: 'subtask_index',
    header: 'Subtask',
  },
]

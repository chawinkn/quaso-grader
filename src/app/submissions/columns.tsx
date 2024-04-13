'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type SubmissionData = {
  id: number
  taskId: string
  userId: number
  status: string
  score: number
  submittedAt: string
  language: string
  time: number
  memory: number
}

function formatDateTime(dateTimeString: string) {
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
    accessorKey: 'userId',
    header: ({ column }) => {
      return (
        <div>
          <span className="flex items-center">
            User
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
  },
  // {
  //   accessorKey: 'language',
  //   header: ({ column }) => {
  //     return (
  //       <div className="hidden sm:flex">
  //         <span className="flex items-center">
  //           Language
  //           <Button
  //             variant="ghost"
  //             size="icon"
  //             className="border-0"
  //             onClick={() =>
  //               column.toggleSorting(
  //                 column.getIsSorted() === 'asc' || !column.getIsSorted()
  //               )
  //             }
  //           >
  //             <ArrowUpDown className="w-4 h-4" />
  //           </Button>
  //         </span>
  //       </div>
  //     )
  //   },
  //   enableHiding: true,
  //   cell: ({ row }) => {
  //     return <div className="hidden sm:flex">{row.getValue('language')}</div>
  //   },
  // },
  // {
  //   accessorKey: 'time',
  //   header: ({ column }) => {
  //     return (
  //       <div className="hidden sm:flex">
  //         <span className="flex items-center">
  //           Time
  //           <Button
  //             variant="ghost"
  //             size="icon"
  //             className="border-0"
  //             onClick={() =>
  //               column.toggleSorting(
  //                 column.getIsSorted() === 'asc' || !column.getIsSorted()
  //               )
  //             }
  //           >
  //             <ArrowUpDown className="w-4 h-4" />
  //           </Button>
  //         </span>
  //       </div>
  //     )
  //   },
  //   cell: ({ row }) => {
  //     return <div className="hidden sm:flex">{row.getValue('time')}</div>
  //   },
  // },
  // {
  //   accessorKey: 'memory',
  //   header: ({ column }) => {
  //     return (
  //       <div className="hidden sm:flex">
  //         <span className="flex items-center">
  //           Memory
  //           <Button
  //             variant="ghost"
  //             size="icon"
  //             className="border-0"
  //             onClick={() =>
  //               column.toggleSorting(
  //                 column.getIsSorted() === 'asc' || !column.getIsSorted()
  //               )
  //             }
  //           >
  //             <ArrowUpDown className="w-4 h-4" />
  //           </Button>
  //         </span>
  //       </div>
  //     )
  //   },
  //   cell: ({ row }) => {
  //     return <div className="hidden sm:flex">{row.getValue('memory')} kB</div>
  //   },
  // },
]

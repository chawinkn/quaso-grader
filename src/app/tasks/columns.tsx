'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type TasksData = {
  id: number
  title: string
  fullScore: number
  private: boolean
  passCount: number
}

export const columns: ColumnDef<TasksData>[] = [
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
            Pass
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
      return (
        <div className="hidden sm:flex">{row.getValue('passCount') || 0}</div>
      )
    },
  },
  {
    accessorKey: 'fullScore',
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
      return <div>0 / {row.getValue('fullScore')}</div>
    },
  },
]

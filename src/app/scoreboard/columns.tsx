'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export type ScoreboardData = {
  rank: number
  id: string
  name: string
  passCount: number
  score: number
}

export const columns: ColumnDef<ScoreboardData>[] = [
  {
    accessorKey: 'rank',
    header: ({ column }) => {
      return (
        <div>
          <span className="flex items-center">
            Rank
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
    accessorKey: 'name',
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
    cell: ({ row }) => {
      const id = row.original.id
      const name = row.original.name
      return (
        <Link
          className="hover:underline"
          href={`/profile/${id}`}
          target="_blank"
        >
          {name}
        </Link>
      )
    },
  },
  {
    accessorKey: 'passCount',
    header: ({ column }) => {
      return (
        <div>
          <span className="flex items-center">
            Passed
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
      return (
        <div className="bg-primary dark:bg-muted/90 px-2.5 py-0.5 rounded text-white font-medium w-fit">
          <span>{row.getValue('score')}</span>
        </div>
      )
    },
  },
]

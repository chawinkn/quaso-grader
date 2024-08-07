'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, Router, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import toast from 'react-hot-toast'
import { PenSquare } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'

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
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: 'private',
    header: ({ column }) => {
      return (
        <div>
          <span className="flex items-center">
            Available
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
      const router = useRouter()
      const initialPrivate = row.getValue('private')
      const [isPrivate, setIsPrivate] = useState(initialPrivate)
      const [loading, setLoading] = useState(false)
      const id = row.getValue('id')
      const handlePrivate = async () => {
        setLoading(true)
        try {
          const request = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
              private: !isPrivate,
            }),
          })

          if (request.ok) {
            toast.success(`TaskID: ${id} updated successfully`)
            setIsPrivate(!isPrivate)
            router.refresh()
          } else {
            toast.error(`TaskID: ${id} update failed`)
          }
        } catch (error: any) {
          console.error(error)
          toast.error(error.message)
        }
        setLoading(false)
      }
      return (
        <div>
          <Switch
            onClick={handlePrivate}
            checked={!isPrivate}
            disabled={loading}
          ></Switch>
        </div>
      )
    },
  },
  {
    id: 'edit',
    header: 'Edit',
    cell: ({ row }) => {
      const router = useRouter()
      return (
        <Button
          variant="outline"
          className="p-0 h-9 w-9"
          onClick={() => {
            router.push(`/dashboard/tasks/edit/${row.getValue('id')}`)
          }}
        >
          <PenSquare className="w-5 h-5" />
        </Button>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original
      const router = useRouter()
      const handleDelete = async () => {
        const id = row.getValue('id')

        try {
          const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
          const result = await res.json()
          if (!res?.ok) {
            return toast.error(result.error)
          }
          toast.success(`TaskID: ${id} deleted successfully`)
          router.refresh()
        } catch (error: any) {
          toast.error(`TaskID: ${id} ${error.message}`)
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

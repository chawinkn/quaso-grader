'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Router } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cx } from 'class-variance-authority'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    accessorKey: 'private',
    header: ({ column }) => {
      return (
        <div className="hidden sm:flex">
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
      const router = useRouter();
      const initialPrivate = row.getValue('private')
      const [isPrivate, setIsPrivate] = useState(initialPrivate);
      const [loading, setLoading] = useState(false)
      const id = row.getValue('id');
      const handlePrivate = async () => {
        setLoading(true);
        try {
          const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              private: !isPrivate,
            }),
          })

          if (request.ok) {
            toast.success('Task updated')
            setIsPrivate(!isPrivate);
            router.refresh();
          } else {
            console.log(request.text())
            toast.error('Task update failed')
          }
          
        } catch (error:any) {
          console.error(error);
          toast.error(error.message);
        }
        setLoading(false);
      }
      return (
        <div className="hidden sm:flex">
          <Switch onClick={handlePrivate} checked={!isPrivate} disabled={loading}></Switch>
        </div>
      )
    },
  },
]

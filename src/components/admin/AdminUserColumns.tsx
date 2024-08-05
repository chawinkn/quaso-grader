'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { MoreHorizontal } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { Checkbox } from '../ui/checkbox'

export type UserData = {
  id: number
  username: string
  name: string
  group: string
  role: string
  createdAt: string
  updatedAt: string
  approved: boolean
}

export const columns: ColumnDef<UserData>[] = [
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
    accessorKey: 'group',
    header: ({ column }) => {
      return (
        <div>
          <span className="flex items-center">
            Group
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
    accessorKey: 'username',
    header: ({ column }) => {
      return (
        <div>
          <span className="flex items-center">
            Username
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
        <Link
          className="hover:underline"
          href={`/profile/${row.getValue('id')}`}
          target="_blank"
        >
          {row.getValue('username')}
        </Link>
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
      return (
        <Link
          className="hover:underline"
          href={`/profile/${row.getValue('id')}`}
          target="_blank"
        >
          {row.getValue('name')}
        </Link>
      )
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <div>
          <span className="flex items-center">
            Admin
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
      const [role, setRole] = useState<string>(row.getValue('role'))
      const [isChanged, setIsChanged] = useState<boolean>(false)
      const handleChange = async (event: any) => {
        setIsChanged(true)
        setRole(role === 'ADMIN' ? 'USER' : 'ADMIN')
        const id = row.getValue('id')
        const name = row.getValue('name')
        const approved = row.getValue('approved')
        try {
          const request = await fetch(`/api/users`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: id,
              name: name,
              role: role === 'ADMIN' ? 'USER' : 'ADMIN',
              approved: approved,
            }),
          })

          if (request.ok) {
            toast.success(`UserID: ${id} role changed successfully`)
            const data = await request.json()
            setRole(data.role)
          } else {
            setRole(row.getValue('role'))
            toast.error(request.statusText)
          }
        } catch (error) {
          setRole(row.getValue('role'))
          console.error(error)
          toast.error(`UserID: ${id} unchanged`)
        }
        setIsChanged(false)
      }
      return (
        <Switch
          onClick={handleChange}
          disabled={isChanged}
          checked={role === 'ADMIN'}
        />
      )
    },
  },
  {
    accessorKey: 'approved',
    header: ({ column }) => {
      return (
        <div>
          <span className="flex items-center">
            Approved
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
      const [approved, setApproved] = useState<boolean>(
        row.getValue('approved')
      )
      const [isChanged, setIsChanged] = useState<boolean>(false)
      const handleChange = async (event: any) => {
        setIsChanged(true)
        setApproved(!approved)
        const id = row.getValue('id')
        const name = row.getValue('name')
        const role = row.getValue('role')
        try {
          const request = await fetch(`/api/users`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: id,
              name: name,
              role: role,
              approved: !approved,
            }),
          })

          if (request.ok) {
            toast.success(
              `UserID: ${id} ${
                !approved ? 'approved' : 'unapproved'
              } successfully`
            )
            const data = await request.json()
            setApproved(data.approved)
          } else {
            setApproved(row.getValue('approved'))
            toast.error(request.statusText)
          }
        } catch (error) {
          console.error(error)
          setApproved(row.getValue('approved'))
          toast.error(`UserID: ${id} unchanged`)
        }
        setIsChanged(false)
      }
      return (
        <Switch
          disabled={isChanged}
          onClick={handleChange}
          checked={approved}
        />
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const router = useRouter()
      const handleDelete = async () => {
        const id = row.getValue('id')
        try {
          const request = await fetch(`/api/users/${id}`, { method: 'DELETE' })

          if (request.ok) {
            toast.success(`UserID: ${id} deleted successfully`)
            router.refresh()
          } else {
            toast.error(request.statusText)
          }
        } catch (error) {
          console.error(error)
          toast.error(`UserID: ${id} deletion failed`)
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

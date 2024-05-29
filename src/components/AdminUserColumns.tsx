/*
User schema, กุลืมไอน้อง

  id            Int            @id @default(autoincrement())
  username      String?        @unique
  name          String?
  password      String
  role          UserRole       @default(USER)
  submissions   Submission[]
  createdAt     DateTime       @default(now()) @map("created_at")
  updatedAt     DateTime       @updatedAt @map("updated_at")
  announcements Announcement[]
  accounts      Account[]
  sessions      Session[]
  approved      Boolean        @default(false)
*/

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from 'react-hot-toast'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { MoreHorizontal } from "lucide-react"
 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export type UserData = {
    id: number
    username: string
    name: string
    role: string
    createdAt: string
    updatedAt: string
    approved: boolean
}

// ก็อปมาเลย ไอ่น้อง
export const columns: ColumnDef<UserData>[] = [
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
      const [ role, setRole ] = useState<string>(row.getValue('role'));
      const [ isChanged, setIsChanged ] = useState<boolean>(false)
      const handleChange = async (event: any) => {
        setIsChanged(true);
        setRole(role === "ADMIN" ? "USER" : "ADMIN");
        const id = row.getValue('id');
        const name = row.getValue('name');
        const approved = row.getValue('approved');
        try {
          const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: id,
              name: name,
              role: (role === "ADMIN" ? "USER" : "ADMIN"),
              approved: approved,
            }),
          })

          if (request.ok){
            toast.success(`UserID: ${id} role changed successfully`);
            const data = await request.json();
            setRole(data.role);
          } else {
            setRole(row.getValue('role'));
            toast.error(request.statusText);
          }
        } catch (error) {
          setRole(row.getValue('role'));
          console.error(error);
          toast.error(`UserID: ${id} unchanged`);
        }
        setIsChanged(false);
      }
      return (
        <div className="text-center">
          <Switch onClick={handleChange} disabled={isChanged} checked={role === "ADMIN"} />
        </div>
      )
    }
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
      const router = useRouter();
      const [ approved, setApproved ] = useState<boolean>(row.getValue('approved'));
      const [ isChanged, setIsChanged ] = useState<boolean>(false)
      const handleChange = async (event: any) => {
        setIsChanged(true);
        setApproved(!approved);
        const id = row.getValue('id');
        const name = row.getValue('name');
        const role = row.getValue('role');
        try {
          const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
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

          if (request.ok){
            toast.success(`UserID: ${id} ${!approved ? 'approved' : 'unapproved'} successfully`);
            const data = await request.json();
            setApproved(data.approved);
          } else {
            setApproved(row.getValue('approved'));
            toast.error(request.statusText);
          }
        } catch (error) {
          console.error(error);
          setApproved(row.getValue('approved'));
          toast.error(`UserID: ${id} unchanged`);
        }
        setIsChanged(false);
      }
      return (
        <div className="text-center pr-4">
          <Switch disabled={isChanged} onClick={handleChange} checked={approved}/>
        </div>
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <div>
          <span className="flex items-center">
            Date Created
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
      const date = new Date(row.getValue('createdAt'))

      return (
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {date.toLocaleDateString()}
          </TooltipTrigger>
          <TooltipContent>
            {date.toLocaleTimeString()}
          </TooltipContent>
        </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return (
        <div>
          <span className="flex items-center">
            Date Updated
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
      const date = new Date(row.getValue('updatedAt'))

      return (
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {date.toLocaleDateString()}
          </TooltipTrigger>
          <TooltipContent>
            {date.toLocaleTimeString()}
          </TooltipContent>
        </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
      const router = useRouter()
      const handleDelete = async () => {
        const id = row.getValue('id')
        try {
          const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (request.ok){
            toast.success(`UserID: ${id} deleted successfully`);
            router.refresh();
          } else {
            toast.error(request.statusText);
          }
        } catch (error) {
          console.error(error);
          toast.error(`UserID: ${id} deletion failed`);
        }
      }
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-red-500"
              onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

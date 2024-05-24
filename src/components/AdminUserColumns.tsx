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
      /*
      return (
        <>
          <Badge variant={row.getValue("role") === "ADMIN" ? "default" : "outline"}>{row.getValue('role')}</Badge>
        </>
      )
      */
      return (
        <div className="text-center">
          <Switch checked={row.getValue('role') === 'ADMIN'} />
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
      return (
        <div className="text-center pr-4">
          <Switch checked={row.getValue('approved')} />
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
      console.log(date);

      return (
        <>
          {date.toLocaleString()}
        </>
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
      console.log(date);

      return (
        <>
          {date.toLocaleString()}
        </>
      )
    },
  },
]

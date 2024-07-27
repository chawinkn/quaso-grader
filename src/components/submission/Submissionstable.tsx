'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface DataTableProps<TData, TValue, TUsername, TRole> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  username: TUsername
  role: TRole
}

export default function SubmissionsTable<TData, TValue, TUsername, TRole>({
  columns,
  data,
  username,
  role,
}: DataTableProps<TData, TValue, TUsername, TRole>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  const router = useRouter()

  return (
    <>
      <div className="flex flex-col items-center mb-5 space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Input
          placeholder="Find user..."
          value={(table.getColumn('user')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('user')?.setFilterValue(event.target.value)
          }}
          className="w-[250px] lg:w-[300px]"
        />
        <Input
          placeholder="Find task id..."
          value={(table.getColumn('taskId')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('taskId')?.setFilterValue(event.target.value)
          }}
          className="w-[250px] lg:w-[300px]"
        />
      </div>
      <Card className="w-[350px] sm:w-[550px] md:w-[750px] lg:w-[950px]">
        <Table>
          <TableHeader className="bg-muted/80">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    (username === row.getValue('user') || role === 'ADMIN') &&
                      'cursor-pointer',
                    index % 2 ? 'bg-muted/30' : ''
                  )}
                  onClick={() => {
                    if (username === row.getValue('user') || role === 'ADMIN') {
                      router.push(`/submissions/${row.getValue('id')}`)
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No submissions.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  )
}

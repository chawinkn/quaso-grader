'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export default function SubmissionsTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
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
          value={(table.getColumn('userId')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('userId')?.setFilterValue(event.target.value)
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
                  className={index % 2 ? 'bg-muted/30' : ''}
                  onClick={() => {
                    router.push(`/submissions/${row.getValue('id')}`)
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

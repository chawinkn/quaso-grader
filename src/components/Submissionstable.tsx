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
import { Button } from './ui/button'
import {
  ChevronFirst,
  ChevronLeft,
  ChevronRight,
  ChevronLast,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

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
    getPaginationRowModel: getPaginationRowModel(),
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
      <div className="flex items-center mt-4 space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[65px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden p-0 h-9 w-9 sm:flex"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronFirst className="w-5 h-5" />
            <span className="sr-only">First page</span>
          </Button>
          <Button
            variant="outline"
            className="p-0 h-9 w-9 "
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button
            variant="outline"
            className="p-0 h-9 w-9"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="w-5 h-5" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button
            variant="outline"
            className="hidden p-0 h-9 w-9 sm:flex"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronLast className="w-5 h-5" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </>
  )
}

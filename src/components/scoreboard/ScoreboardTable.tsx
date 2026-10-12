'use client'

import {
  ColumnDef,
  RowData,
  ColumnFiltersState,
  SortingState,
  flexRender,
  useTable,
} from '@tanstack/react-table'
import { features, Features } from '@/lib/table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Input } from '@/components/ui/input'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
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
} from '../ui/select'

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<Features, TData>[]
  data: TData[]
}

export default function ScoreboardTable<TData extends RowData>({
  columns,
  data,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const table = useTable({
    features,
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
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
          placeholder="Find class..."
          value={
            (table.getColumn('className')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) => {
            table.getColumn('className')?.setFilterValue(event.target.value)
          }}
          className="w-[250px] lg:w-[300px]"
        />
        <Input
          placeholder="Find user..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('name')?.setFilterValue(event.target.value)
          }}
          className="w-[250px] lg:w-[300px]"
        />
      </div>
      <div className="w-[350px] sm:w-[550px] md:w-[750px] lg:w-[950px]">
        <Table>
          <TableHeader className="bg-muted">
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
                  className={index % 2 ? 'bg-muted/50' : ''}
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
                  No entries on the scoreboard.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center mt-4 space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.state.pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[65px]">
              <SelectValue placeholder={table.state.pagination.pageSize} />
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
          Page {table.state.pagination.pageIndex + 1} of {table.getPageCount()}
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

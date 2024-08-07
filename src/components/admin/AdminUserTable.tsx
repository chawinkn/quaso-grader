'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  RowModel,
  SortingState,
  VisibilityState,
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

import { Input } from '@/components/ui/input'
import { Button } from '../ui/button'
import {
  ChevronFirst,
  ChevronLeft,
  ChevronRight,
  ChevronLast,
  Loader2,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Card } from '@/components/ui/card'
import * as React from 'react'
import { DataTableViewOptions } from '../ViewOptions'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export default function AdminUserTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  const [isSubmit, setSubmit] = React.useState(false)
  const router = useRouter()

  const approveAll = async () => {
    setSubmit(true)

    const updatePromises = table.getSelectedRowModel().rows.map(async (row) => {
      const id = row.getValue('id')
      const name = row.getValue('name')
      const role = row.getValue('role')
      return fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          role,
          approved: true,
        }),
      }).then(async (res) => {
        const result = await res.json()
        if (!res.ok) {
          throw new Error(result.error || 'Failed to update')
        }
        return result
      })
    })

    try {
      await Promise.all(updatePromises)
      toast.success('All users approved successfully')
      router.refresh()
    } catch (error: any) {
      toast.error(`Error: ${error.message}`)
    } finally {
      setSubmit(false)
    }
  }

  const unapproveAll = async () => {
    setSubmit(true)

    const updatePromises = table.getSelectedRowModel().rows.map(async (row) => {
      const id = row.getValue('id')
      const name = row.getValue('name')
      const role = row.getValue('role')
      return fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          role,
          approved: false,
        }),
      }).then(async (res) => {
        const result = await res.json()
        if (!res.ok) {
          throw new Error(result.error || 'Failed to update')
        }
        return result
      })
    })

    try {
      await Promise.all(updatePromises)
      toast.success('All users unapproved successfully')
      router.refresh()
    } catch (error: any) {
      toast.error(`Error: ${error.message}`)
    } finally {
      setSubmit(false)
    }
  }

  const deleteAll = async () => {
    setSubmit(true)

    const updatePromises = table.getSelectedRowModel().rows.map(async (row) => {
      const id = row.getValue('id')

      return fetch(`/api/users/${id}`, { method: 'DELETE' }).then(
        async (res) => {
          const result = await res.json()
          if (!res.ok) {
            throw new Error(result.error || 'Failed to update')
          }
          return result
        }
      )
    })

    try {
      await Promise.all(updatePromises)
      toast.success('All users deleted successfully')
      router.refresh()
    } catch (error: any) {
      toast.error(`Error: ${error.message}`)
    } finally {
      setSubmit(false)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Input
          placeholder="Find class..."
          value={
            (table.getColumn('className')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) => {
            table.getColumn('className')?.setFilterValue(event.target.value)
          }}
        />
        <Input
          placeholder="Find username..."
          value={
            (table.getColumn('username')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) => {
            table.getColumn('username')?.setFilterValue(event.target.value)
          }}
        />
        <Input
          placeholder="Find name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('name')?.setFilterValue(event.target.value)
          }}
        />
        <DataTableViewOptions table={table} />
      </div>
      <div className="flex flex-row justify-center my-2 space-x-4">
        <Button
          onClick={approveAll}
          disabled={isSubmit || !table.getSelectedRowModel().rows.length}
        >
          {isSubmit ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            'Approve'
          )}
        </Button>
        <Button
          onClick={unapproveAll}
          variant="outline"
          disabled={isSubmit || !table.getSelectedRowModel().rows.length}
        >
          {isSubmit ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            'Unapprove'
          )}
        </Button>
        <Button
          onClick={deleteAll}
          variant="destructive"
          disabled={isSubmit || !table.getSelectedRowModel().rows.length}
        >
          {isSubmit ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            'Delete'
          )}
        </Button>
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
                  No User Data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <div className="flex flex-row items-center justify-center mt-4 space-x-6 lg:space-x-8">
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

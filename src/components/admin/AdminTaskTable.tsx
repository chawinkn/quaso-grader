'use client'

import {
  ColumnDef,
  ColumnFiltersState,
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

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import * as React from 'react'
import { useRouter } from 'next/navigation'

import { Button, buttonVariants } from '../ui/button'
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
import { Label } from '../ui/label'
import { DataTableViewOptions } from '../ViewOptions'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  id: string
}

export default function TasksTable<TData, TValue>({
  columns,
  data,
  id,
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
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  const [isSubmit, setSubmit] = React.useState(false)
  const router = useRouter()

  const availableAll = async () => {
    setSubmit(true)

    const updatePromises = table.getSelectedRowModel().rows.map(async (row) => {
      const id = row.getValue('id')
      return fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          private: false,
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
      toast.success('All tasks available successfully')
      router.refresh()
    } catch (error: any) {
      toast.error(`Error: ${error.message}`)
    } finally {
      setSubmit(false)
    }
  }

  const unavailableAll = async () => {
    setSubmit(true)

    const updatePromises = table.getSelectedRowModel().rows.map(async (row) => {
      const id = row.getValue('id')
      return fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          private: true,
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
      toast.success('All tasks unavailable successfully')
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

      return fetch(`/api/tasks/${id}`, { method: 'DELETE' }).then(
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
      toast.success('All tasks deleted successfully')
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
          placeholder="Find id..."
          value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('id')?.setFilterValue(event.target.value)
          }}
          className="w-[250px] lg:w-[300px]"
        />
        <Input
          placeholder="Find title..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('title')?.setFilterValue(event.target.value)
          }}
          className="w-[250px] lg:w-[300px]"
        />
        <DataTableViewOptions table={table} />
      </div>
      <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="space-x-4">
          <Button
            onClick={availableAll}
            disabled={isSubmit || !table.getSelectedRowModel().rows.length}
          >
            {isSubmit ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              'Available'
            )}
          </Button>
          <Button
            onClick={unavailableAll}
            variant="outline"
            disabled={isSubmit || !table.getSelectedRowModel().rows.length}
          >
            {isSubmit ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              'Unavailable'
            )}
          </Button>
        </div>
        <div className="space-x-4">
          <Link href={`/dashboard/tasks/create/${id}`}>
            <Button>Create Task</Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isSubmit || !table.getSelectedRowModel().rows.length}
              >
                {isSubmit ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  'Delete'
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete all selected tasks?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteAll}
                  className={buttonVariants({ variant: 'destructive' })}
                >
                  {isSubmit ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    'Delete'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="flex justify-center">
        <Label>* To edit a task, it must be marked as unavailable</Label>
      </div>
      <Card className="w-[350px] sm:w-[550px] md:w-[750px] lg:w-[950px]">
        <Table>
          <TableHeader className="bg-muted/70">
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
                  className={index % 2 === 1 ? 'bg-muted/30' : ''}
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
                  No tasks.
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

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import * as React from 'react'
import { useRouter } from 'next/navigation'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export default function ProblemsTable<TData, TValue>({
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
      <div className="flex flex-col sm:flex-row items-center mb-5 space-y-4 sm:space-x-4 sm:space-y-0">
        <Input
          placeholder="Find name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="w-[250px] lg:w-[300px]"
        />
        <Select defaultValue="all">
          <SelectTrigger className="w-[250px] lg:w-[300px]">
            <SelectValue placeholder="Select a group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ALL</SelectItem>
            <SelectItem value="group1">group1</SelectItem>
            <SelectItem value="group2">group2</SelectItem>
          </SelectContent>
        </Select>
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
                  className={
                    index % 2 === 1
                      ? 'bg-muted/30 cursor-pointer'
                      : 'cursor-pointer'
                  }
                  onClick={() => {
                    router.push(`/problems/${row.getValue('problemId')}`)
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
                  No problems.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  )
}

// 'use client'

// import { ColumnDef } from '@tanstack/react-table'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import { Card } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { FileUp } from 'lucide-react'
// import Link from 'next/link'

// type ProblemsData = [
//   {
//     name: string
//     problemId: number
//     passCount: number
//     score: number
//   }
// ]

// export default function ProblemsTable({ ...props }) {
//   const problemList: ProblemsData = props?.problemList

//   return (
//     <></>
//     // <Card className="w-[350px] sm:w-[550px] md:w-[700px]">
//     //   <Table>
//     //     <TableHeader>
//     //       <TableRow>
//     //         <TableHead>ID</TableHead>
//     //         <TableHead>Name</TableHead>
//     //         <TableHead className="hidden text-center sm:grid sm:items-center">
//     //           Pass
//     //         </TableHead>
//     //         <TableHead className="text-center">Score</TableHead>
//     //         <TableHead className="text-center">#</TableHead>
//     //       </TableRow>
//     //     </TableHeader>
//     //     {problemList.length ? (
//     //       <TableBody>
//     //         {problemList.map((rows) => (
//     //           <TableRow key={rows.problemId}>
//     //             <TableCell>{rows.problemId}</TableCell>
//     //             <TableCell>{rows.name}</TableCell>
//     //             <TableCell className="hidden text-center sm:table-cell">
//     //               {rows.passCount}
//     //             </TableCell>
//     //             <TableCell className="text-center">0 / {rows.score}</TableCell>
//     //             <TableCell className="text-center">
//     //               <Link href={`/problems/${rows.problemId}`}>
//     //                 <Button variant="outline" size="icon">
//     //                   <FileUp className="w-5 h-5" />
//     //                 </Button>
//     //               </Link>
//     //             </TableCell>
//     //           </TableRow>
//     //         ))}
//     //       </TableBody>
//     //     ) : (
//     //       <TableBody>
//     //         <TableRow>
//     //           <TableCell colSpan={5} className="text-center">
//     //             No problems to display.
//     //           </TableCell>
//     //         </TableRow>
//     //       </TableBody>
//     //     )}
//     //   </Table>
//     // </Card>
//   )
// }

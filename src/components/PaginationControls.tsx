'use client'

import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from './ui/button'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from './ui/select'
import { useRouter, useSearchParams } from 'next/navigation'

export default function PaginationControls({
  hasNextPage,
  hasPrevPage,
  pageCount,
  path,
}: {
  hasNextPage: boolean
  hasPrevPage: boolean
  pageCount: number
  path: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = searchParams.get('page') ?? '1'
  const per_page = searchParams.get('per_page') ?? '10'

  return (
    <div className="flex items-center mt-4 space-x-6 lg:space-x-8">
      {/* <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={per_page}
          // onValueChange={(value) => {
          //   table.setPageSize(Number(value))
          // }}
        >
          <SelectTrigger className="h-8 w-[65px]">
            <SelectValue
            // placeholder={table.getState().pagination.pageSize}
            />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}
      <div className="text-sm font-medium">
        Page {page} of {pageCount}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden p-0 h-9 w-9 sm:flex"
          onClick={() => router.push(`${path}/?page=1&per_page=${per_page}`)}
          disabled={Number(page) === 1}
        >
          <ChevronFirst className="w-5 h-5" />
          <span className="sr-only">First page</span>
        </Button>
        <Button
          variant="outline"
          className="p-0 h-9 w-9 "
          onClick={() =>
            router.push(
              `${path}/?page=${Number(page) - 1}&per_page=${per_page}`
            )
          }
          disabled={!hasPrevPage}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="sr-only">Previous page</span>
        </Button>
        <Button
          variant="outline"
          className="p-0 h-9 w-9"
          onClick={() => {
            router.push(
              `${path}/?page=${Number(page) + 1}&per_page=${per_page}`
            )
          }}
          disabled={!hasNextPage}
        >
          <ChevronRight className="w-5 h-5" />
          <span className="sr-only">Next page</span>
        </Button>
        <Button
          variant="outline"
          className="hidden p-0 h-9 w-9 sm:flex"
          onClick={() =>
            router.push(`${path}/?page=${pageCount}&per_page=${per_page}`)
          }
          disabled={Number(page) === pageCount}
        >
          <ChevronLast className="w-5 h-5" />
          <span className="sr-only">Last page</span>
        </Button>
      </div>
    </div>
  )
}

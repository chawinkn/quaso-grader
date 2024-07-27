import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { Skeleton } from './ui/skeleton'

export function AnnouncementCardSkeleton() {
  return (
    <>
      <Skeleton className="w-[350px] sm:w-[450px] md:w-[600px] xl:w-[700px] h-[200px]" />
      <Skeleton className="w-[350px] sm:w-[450px] md:w-[600px] xl:w-[700px] h-[200px]" />
      <Skeleton className="w-[350px] sm:w-[450px] md:w-[600px] xl:w-[700px] h-[200px]" />
    </>
  )
}

export function TableSkeleton({
  row,
  column,
}: {
  row: number
  column: number
}) {
  const rows = Array.from({ length: row })
  const columns = Array.from({ length: column })

  return (
    <>
      <div className="w-[350px] sm:w-[550px] md:w-[750px] lg:w-[950px]">
        <Table>
          <TableHeader className="bg-muted/70">
            <TableRow>
              {columns.map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-5 w-[100px] md:w-[150px] lg:w-[200px]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((_, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={rowIndex % 2 === 1 ? 'bg-muted/30' : ''}
              >
                {columns.map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className="h-5 w-[100px] md:w-[150px] lg:w-[200px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export function TaskLayoutSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-10 grow">
      <Skeleton className="h-10 w-[250px]" />
      <Skeleton className="h-5 w-[150px]" />
      <div className="w-4/5 my-5 space-y-4 lg:w-4/6 sm:space-x-4">
        <Skeleton className="h-screen " />
      </div>
      <div className="flex flex-col mt-10 space-y-4 grow lg:flex-row lg:space-x-2">
        <div className="w-[350px] sm:w-[500px] xl:w-[700px] 2xl:w-[800px] h-[500px] overflow-hidden my-4 lg:mx-8">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="flex flex-col space-y-5">
          <Skeleton className="h-10 w-[250px]" />
          <div className="flex flex-row space-x-4">
            <Skeleton className="w-1/2 h-10" />
            <Skeleton className="w-1/2 h-10" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SubmissionLayoutSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Skeleton className="h-10 w-[250px]" />
      <div className="flex flex-col items-center justify-center my-5 w-10/12 lg:w-[950px] ">
        <Skeleton className="h-[150px] w-full" />
      </div>
      <div className="flex flex-col items-center w-full mt-4">
        <div className="relative w-10/12 lg:w-[950px] overflow-hidden monaco-font space-y-2">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
      </div>
    </div>
  )
}

export function EditTaskSkeleton() {
  return (
    <>
      <Skeleton className="w-[350px] sm:w-[450px] md:w-[600px] xl:w-[700px] h-[120px]" />
      <Skeleton className="w-[350px] sm:w-[450px] md:w-[600px] xl:w-[700px] h-[300px]" />
    </>
  )
}

export function GeneralPanelSkeleton() {
  return (
    <Skeleton className="w-[350px] sm:w-[450px] md:w-[600px] xl:w-[700px] h-[300px]" />
  )
}

export function ProfileSkeleton() {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <Skeleton className="h-10 w-[250px]" />
        <div className="w-4/5 my-5 space-y-4 lg:w-4/6">
          <div className="flex flex-row mt-6 space-x-4">
            <div className="px-4 py-2 text-center rounded-lg bg-muted">
              <p className="text-muted-foreground">Solved</p>
              <Skeleton className="h-10 w-[50px]" />
            </div>
            <div className="px-4 py-2 text-center rounded-lg bg-muted">
              <p className="text-muted-foreground">Submissions</p>
              <Skeleton className="h-10 w-[50px]" />
            </div>
            <div className="px-4 py-2 text-center rounded-lg bg-muted">
              <p className="text-muted-foreground">Score</p>
              <Skeleton className="h-10 w-[50px]" />
            </div>
          </div>
        </div>
        <div className="flex flex-col pt-4">
          <h1 className="text-xl font-medium text-center">
            List of solved problems
          </h1>
          <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-10 w-[150px]" />
            <Skeleton className="h-10 w-[150px]" />
            <Skeleton className="h-10 w-[150px]" />
          </div>
        </div>
      </div>
    </>
  )
}

import { NavigationBar } from '../components/Navbar'
import { Suspense } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type ProblemsData = [
  {
    name: string
    problemId: number
    passCount: number
    score: number
  }
]

export default async function Problems() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/problems`)
  const data: ProblemsData = await res.json()

  return (
    <>
      <NavigationBar />
      <div className="flex flex-col items-center justify-center h-screen">
        <Suspense
          fallback={
            <h1 className="animate-pulse text-lg font-bold">Loading...</h1>
          }
        >
          <Card className="w-[400px] sm:w-[550px] md:w-[700px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">Pass</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">#</TableHead>
                </TableRow>
              </TableHeader>
              {data.length ? (
                <TableBody>
                  {data.map((rows) => (
                    <TableRow key={rows.problemId}>
                      <TableCell>{rows.problemId}</TableCell>
                      <TableCell>{rows.name}</TableCell>
                      <TableCell className="text-center">
                        {rows.passCount}
                      </TableCell>
                      <TableCell className="text-center">
                        0 / {rows.score}
                      </TableCell>
                      <TableCell className="text-center">
                        <Link href={`/problems/${rows.problemId}`}>
                          <Button className="w-12 h-9">Edit</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No problems to display.
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </Card>
        </Suspense>
      </div>
    </>
  )
}

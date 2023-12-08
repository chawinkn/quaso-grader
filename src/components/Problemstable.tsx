import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type ProblemsData = [
  {
    name: string
    problemId: number
    passCount: number
    score: number
  }
]

async function getProblemList() {
  // await new Promise((resolve) => setTimeout(resolve, 3000))
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/problems`)
  const data = await res.json()
  return data
}

export default async function ProblemsTable() {
  const problemList: ProblemsData = await getProblemList();
  
  return (
    <Card className="w-[350px] sm:w-[550px] md:w-[700px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:grid sm:items-center text-center">Pass</TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead className="text-center">#</TableHead>
          </TableRow>
        </TableHeader>
        {problemList.length ? (
          <TableBody>
            {problemList.map((rows) => (
              <TableRow key={rows.problemId}>
                <TableCell>{rows.problemId}</TableCell>
                <TableCell>{rows.name}</TableCell>
                <TableCell className="hidden sm:table-cell text-center">{rows.passCount}</TableCell>
                <TableCell className="text-center">0 / {rows.score}</TableCell>
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
  )
}

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

type ProblemsData = [
  {
    name: string
    problemId: number
    passCount: number
    score: number
  }
]

export default async function ProblemsTable() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/problems`)
  const data: ProblemsData = await res.json()

  return (
    <Card className="w-[350px] sm:w-[500px] md:w-[650px]">
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
        <TableBody>
          {data.map((rows) => (
            <TableRow key={rows.problemId}>
              <TableCell>{rows.problemId}</TableCell>
              <TableCell>{rows.name}</TableCell>
              <TableCell className="text-center">{rows.passCount}</TableCell>
              <TableCell className="text-center">0 / {rows.score}</TableCell>
              <TableCell className="text-center">
                <Link href={`/problems/${rows.problemId}`}>
                  <Button className="w-12 h-9">Edit</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

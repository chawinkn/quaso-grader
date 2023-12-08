import { NavigationBar } from '../../components/Navbar'
import { Suspense } from 'react'
import ProblemsTable from '../../components/Problemstable'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const dynamic = 'force-dynamic'

export default async function Problems() {
  return (
    <>
      <NavigationBar />
      <div className="flex flex-col items-center justify-center py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">PROBLEMLIST &#128512;</h1>
        </div>
        <Suspense
          fallback={
            <Card className="w-[350px] sm:w-[550px] md:w-[700px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:grid sm:items-center text-center">
                      Pass
                    </TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead className="text-center">#</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      <p className="animate-pulse text-base">Loading...</p>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          }
        >
          <ProblemsTable />
        </Suspense>
      </div>
    </>
  )
}

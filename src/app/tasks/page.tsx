import TasksTable from '@/components/Taskstable'
import { columns } from './columns'

// export const revalidate = 3600 // revalidate the data at most every hour

// async function getProblemList() {
//   await new Promise((resolve) => setTimeout(resolve, 3000))
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/problems`)
//   if (!res.ok) {
//     throw new Error('Failed to fetch data')
//   }
//   const data = await res.json()
//   const data = await prisma.problem.findMany({
//     orderBy: {
//       problemId: 'asc',
//     },
//   })
//   return data
// }

export default async function Tasks() {
  return (
    <div className="h-screen">
      <div className="flex flex-col items-center justify-center py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">TASKS</h1>
        </div>
        {/* <Suspense
          fallback={
            <Card className="w-[350px] sm:w-[550px] md:w-[700px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden text-center sm:grid sm:items-center">
                      Pass
                    </TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead className="text-center">#</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      <p className="text-base animate-pulse">Loading...</p>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          }
        > */}
        {/* <ProblemsTable columns={columns} data={problemList} /> */}
        <TasksTable columns={columns} data={[]} />
        {/* </Suspense> */}
      </div>
    </div>
  )
}

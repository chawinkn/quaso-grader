import { NavigationBar } from '@/components/Navbar'
import ProblemsTable from '@/components/Problemstable'
import { columns } from './columns'

export const revalidate = 3600 // revalidate every hour

async function getProblemList() {
  // await new Promise((resolve) => setTimeout(resolve, 3000))
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/problems`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  const data = await res.json()
  return data
}

export default async function Problems() {
  const problemList = await getProblemList()

  return (
    <>
      <NavigationBar />
      <div className="flex flex-col items-center justify-center py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">PROBLEMLIST</h1>
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
        <ProblemsTable columns={columns} data={problemList} />
        {/* </Suspense> */}
      </div>
    </>
  )
}

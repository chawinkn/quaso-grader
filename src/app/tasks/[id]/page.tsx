import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import TaskLayout from '@/components/Tasklayout'
import { Suspense } from 'react'

type TaskProps = {
  params: {
    id: string
  }
}

// async function getProblem(id: string) {
//   // await new Promise((resolve) => setTimeout(resolve, 3000))
//   const res = await prisma.problem.findFirst({
//     where: {
//       problemId: Number(id),
//     },
//   })
//   if (!res) {
//     return notFound()
//   }
//   return res
// }

export default async function Tasks({ params }: TaskProps) {
  // const problem = await getProblem(params.id)

  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-screen py-10">
          <p className="text-base animate-pulse">Loading...</p>
        </div>
      }
    >
      <TaskLayout task={[]} />
    </Suspense>
  )
}

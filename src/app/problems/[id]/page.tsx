import { NavigationBar } from '@/app/components/Navbar'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

type ProblemProps = {
  params: {
    id: string
  }
}

export default async function Problems({ params }: ProblemProps) {
  const res = await prisma.problem.findFirst({
    where: { problemId: Number(params.id) },
  })

  if (!res) {
    return notFound()
  }

  return (
    <>
      <NavigationBar />
      <div className="flex flex-col items-center justify-center h-screen">
        {res.name}
      </div>
    </>
  )
}

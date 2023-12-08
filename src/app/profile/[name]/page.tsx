import { NavigationBar } from '@/components/Navbar'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

type ProfileProps = {
  params: {
    name: string
  }
}

export default async function Problems({ params }: ProfileProps) {
  const res = await prisma.user.findFirst({
    where: { username: params.name },
  })

  if (!res) {
    return notFound()
  }

  return (
    <>
      <NavigationBar />
      <div className="flex flex-col items-center justify-center h-screen">
        {params.name}
      </div>
    </>
  )
}

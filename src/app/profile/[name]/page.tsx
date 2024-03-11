import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

type ProfileProps = {
  params: {
    name: string
  }
}

export default async function Profile({ params }: ProfileProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {params.name}
    </div>
  )
}

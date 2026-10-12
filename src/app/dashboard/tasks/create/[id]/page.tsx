import CreateTaskLayout from '@/components/admin/AdminCreateTask'
import { Suspense } from 'react'
import { getGroup } from '../../[id]/page'

async function Layout({ id }: { id: string }) {
  await getGroup(id)

  return <CreateTaskLayout groupId={id} />
}

export default async function CreateTask({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {
  const { id } = await params
  return (
    <div className="min-h-[calc(100vh-57px)] flex">
      <Suspense fallback={null}>
        <Layout id={id} />
      </Suspense>
    </div>
  )
}

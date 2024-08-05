import CreateTaskLayout from '@/components/admin/AdminCreateTask'
import { Suspense } from 'react'
import { getGroup } from '../../groups/[id]/page'

async function Layout({ id }: { id: string }) {
  await getGroup(id)

  return <CreateTaskLayout groupId={id} />
}

export default function CreateTask({
  params,
}: {
  params: {
    id: string
  }
}) {
  return (
    <div className="min-h-[calc(100vh-57px)] flex">
      <Suspense fallback={null}>
        <Layout id={params.id} />
      </Suspense>
    </div>
  )
}

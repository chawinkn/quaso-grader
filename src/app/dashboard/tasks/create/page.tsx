import CreateTaskLayout from '@/components/admin/AdminCreateTask'
import { Suspense } from 'react'

export default function CreateTask() {
  return (
    <div className="min-h-[calc(100vh-57px)] flex">
      <Suspense fallback={null}>
        <CreateTaskLayout />
      </Suspense>
    </div>
  )
}

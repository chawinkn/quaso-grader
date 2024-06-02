import CreateTaskLayout from '@/components/admin/CreateTask'
import { Suspense } from 'react'

export default function CreateTask() {
  return (
    <div className="min-h-screen flex">
      <Suspense fallback={null}>
        <CreateTaskLayout />
      </Suspense>
    </div>
  )
}

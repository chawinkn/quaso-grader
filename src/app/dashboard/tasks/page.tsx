import { Suspense } from 'react'
import { columns } from './columns'
import { headers } from 'next/headers'
import { TableSkeleton } from '@/components/skeletons'
import GroupsTable from '@/components/admin/AdminGroupTable'

async function getGroupList() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/groups`, {
    method: 'GET',
    headers: new Headers(headers()),
  })
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  return data
}

async function GroupTable() {
  const groupList = await getGroupList()

  return <GroupsTable columns={columns} data={groupList} />
}

export default function AdminGroups() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<TableSkeleton row={5} column={6} />}>
        <GroupTable />
      </Suspense>
    </div>
  )
}

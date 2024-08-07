import { Suspense } from 'react'
import { headers } from 'next/headers'
import { columns } from './AdminUserColumns'
import AdminUserTable from './AdminUserTable'
import { TableSkeleton } from '../skeletons'
import { group } from 'console'

async function getUserList() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    method: 'GET',
    headers: new Headers(headers()),
  })
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  return data
}

async function UserTable() {
  const userList = await getUserList()

  return <AdminUserTable columns={columns} data={userList} />
}

export default function User() {
  return (
    <Suspense fallback={<TableSkeleton row={5} column={8} />}>
      <UserTable />
    </Suspense>
  )
}

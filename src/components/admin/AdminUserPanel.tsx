import { Suspense } from 'react'
import { headers } from 'next/headers'
import { columns } from './AdminUserColumns'
import AdminUserTable from './AdminUserTable'

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

export default async function User() {
  const userList = await getUserList()

  return (
    <Suspense fallback={null}>
      <AdminUserTable columns={columns} data={userList} />
    </Suspense>
  )
}

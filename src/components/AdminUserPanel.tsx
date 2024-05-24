import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import { columns } from './AdminUserColumns';
import AdminUserTable from './AdminUserTable';

async function getUserList() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    method: 'GET',
    headers: new Headers(headers()),
  })
  if (!res) {
    return null
  }
  const data = await res.json()
  return data
}

export default async function User() {

  const userList = await getUserList();

  /*
  return (
    <Card className="w-full min-h-[250px] h-max">
      <CardHeader>
        <CardTitle>User</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={null}>
          <AdminUserTable columns={columns} data={userList} />
        </Suspense>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
  */
 return (
    <Suspense fallback={null}>
      <AdminUserTable columns={columns} data={userList} />
    </Suspense>
 )
}

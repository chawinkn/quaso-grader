"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';

import { columns } from './AdminUserColumns';
import AdminUserTable from './AdminUserTable';

export default function User() {

    return (
    <Card className='w-full min-h-[250px] h-max'>
        <CardHeader>
            <CardTitle>User</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={null}>
            <AdminUserTable columns={columns} data={[]} />
          </Suspense>
        </CardContent>
        <CardFooter>
        </CardFooter>
    </Card>
    )
}

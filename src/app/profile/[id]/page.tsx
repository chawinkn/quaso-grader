import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getServerUser } from '@/lib/session'
import UserPanel from '@/components/UserPanel'

async function getUser(userId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
    {
      method: 'GET',
      headers: new Headers(headers()),
    }
  )
  if (!res) {
    return null
  }
  const data = await res.json()
  if (!data) {
    return notFound()
  }
  return data
}

export default async function Profile({
  params,
}: {
  params: {
    id: string
  }
}) {
  if (isNaN(Number(params.id))) return notFound()
  const User = await getUser(Number(params.id))
  const user = await getServerUser()

  return (
    <div className="flex flex-col items-center h-screen py-10">
      <h1 className="text-3xl font-bold">PROFILE</h1>
      <div className="flex flex-col items-center justify-center flex-grow space-y-4">
        <h1 className="text-2xl font-bold">{User.username}</h1>
        {User.username === user?.name ? (
          <UserPanel {...User} />
        ) : (
          <p className="mt-2 text-md">{User.name}</p>
        )}
      </div>
    </div>
  )
}

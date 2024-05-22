import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

async function getUser(userId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
    {
      method: 'GET',
      headers: new Headers(headers()),
    }
  )
  if (!res) {
    return notFound()
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

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {User.username}
    </div>
  )
}
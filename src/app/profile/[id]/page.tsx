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

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="font-bold text-4xl">{User.username}</h1>
      <p className="mt-2 text-md">{User.name}</p>
    </div>
  )
}

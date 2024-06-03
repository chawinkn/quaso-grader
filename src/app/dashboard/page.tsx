import Link from 'next/link'

export default function Admin() {
  return (
    <div className="flex flex-row gap-4">
      <Link href={'/dashboard/users'}>users</Link>
      <Link href={'/dashboard/tasks'}>tasks</Link>
    </div>
  )
}

import AdminGeneralPanel from '@/components/admin/AdminGeneralPanel'
import { headers } from 'next/headers'

export async function getConfig() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/config`, {
    method: 'GET',
    headers: new Headers(headers()),
  })
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  return data
}

export default async function AdminGeneral() {
  const config = await getConfig()
  return <AdminGeneralPanel config={config} />
}

import AdminGeneralPanel from '@/components/admin/AdminGeneralPanel'
import { headers } from 'next/headers'

export async function getConfig(key: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/config/${key}`, {
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
  const configValues = await Promise.all([
    getConfig('approval_required'),
    getConfig('available_language'),
    getConfig('result_interval'),
  ])

  const config = {
    approval_required: configValues[0]?.value || 'false',
    available_language: configValues[1]?.value || 'c,cpp,python',
    result_interval: configValues[2]?.value || '2.5',
  }
  return <AdminGeneralPanel config={config} />
}

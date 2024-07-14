import AdminGeneralPanel from '@/components/admin/AdminGeneralPanel'
import { getConfig } from '@/utils/generalConfig'

export default async function AdminGeneral() {
  const config = getConfig()
  return <AdminGeneralPanel config={config} />
}

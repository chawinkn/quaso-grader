import { Card, CardBody } from '@nextui-org/react'
import { NavigationBar } from '../components/Navbar'
import ProblemsTable from '../components/Problemstable'

export default function Problems() {
  return (
    <div className="flex flex-col h-screen items-center">
      <NavigationBar></NavigationBar>
      <div className="flex flex-col items-center justify-center h-screen max-w-md md:max-w-2xl lg:max-w-4xl w-full">
        <ProblemsTable />
      </div>
    </div>
  )
}

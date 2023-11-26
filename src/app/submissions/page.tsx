import { Card, CardBody } from '@nextui-org/react'
import { NavigationBar } from '../components/Navbar'

export default function Submissions() {
  return (
    <div className="flex flex-col h-screen items-center">
      <NavigationBar></NavigationBar>
      <div className="flex flex-col items-center justify-center h-screen max-w-md md:max-w-2xl lg:max-w-4xl w-full">
        <Card shadow="sm">
          <CardBody className="p-20">
            <h1 className="text-2xl font-bold">Welcome to submissions!</h1>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

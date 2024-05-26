import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import General from "@/components/AdminGeneralPanel"
import User from "@/components/AdminUserPanel"

export default function Admin() {

  return (
    <main className="flex min-h-screen flex-col gap-4 p-4 md:gap-8 md:p-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold">DASHBOARD</h1>
        <h2 className='text-md text-muted-foreground'></h2>
      </div>
      <div className="flex grow justify-center">
        <Tabs
          defaultValue="general"
          className="min-w-max w-[350px] sm:w-[450px] md:w-[600px] xl:w-[700px] flex flex-col justify-center gap-4"
        >
          <TabsList className="">
            <TabsTrigger className="w-full" value="general">
              General
            </TabsTrigger>
            <TabsTrigger className="w-full" value="user">
              User
            </TabsTrigger>
          </TabsList>
          <TabsContent className="grow mt-0" value="general">
            <General />
          </TabsContent>
          <TabsContent className="grow mt-0" value="user">
            <User />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
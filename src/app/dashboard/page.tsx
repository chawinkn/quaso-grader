import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import General from "@/components/AdminGeneralPanel"
import User from "@/components/AdminUserPanel"

export default function Admin() {
    return (
      <main className="flex min-h-screen flex-col gap-4 p-4 md:gap-8 md:p-10">
        <h1 className="text-3xl text-center font-bold">DASHBOARD</h1>
        <div className="flex grow justify-center">
          <Tabs defaultValue="general" className="min-w-[700px] flex flex-col justify-center gap-4">
            <TabsList className=''>
              <TabsTrigger className='w-full' value="general">General</TabsTrigger>
              <TabsTrigger className='w-full' value="user">User</TabsTrigger>
            </TabsList>
            <TabsContent className='grow mt-0' value="general">
                <General />
            </TabsContent>
            <TabsContent className='grow mt-0' value="user">
                <User />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    )
}
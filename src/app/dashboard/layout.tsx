import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <main className="flex flex-col min-h-screen items-center gap-4 p-4 md:gap-8 md:p-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold">DASHBOARD</h1>
        <h2 className="text-md text-muted-foreground"></h2>
      </div>
      <div className="flex flex-row items-center justify-center gap-2
                      min-w-max w-[350px] sm:w-[450px] md:w-[600px] xl:w-[700px]">
        <Button variant={'outline'} className="w-full" asChild>
          <Link href={'/dashboard/general'} >
            General
          </Link>
        </Button>
        <Button variant={'outline'} className="w-full" asChild>
          <Link href={'/dashboard/users'} >
            Users
          </Link>
        </Button>
        <Button variant={'outline'} className="w-full" asChild>
          <Link href={'/dashboard/tasks'} >
            Tasks
          </Link>
        </Button>
      </div>
      <div className="w-full h-full flex justify-center">
        {children}
      </div>
    </main>
  )
}

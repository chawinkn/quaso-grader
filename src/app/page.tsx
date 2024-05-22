import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getServerUser } from '@/lib/session'
import Announcement from '@/components/Announcement'

function Landing() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold md:text-6xl">Quaso</h1>
      <p className="pt-4 text-lg md:text-xl text-muted-foreground">
        ระบบตรวจและประเมินผลโปรแกรมออนไลน์
      </p>
      <div className="flex-row mt-8 space-x-5">
        <Link href="/register">
          <Button>Register</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
      </div>
    </div>
  )
}

export default async function Home() {
  const user = await getServerUser()

  return (
    <div className="flex flex-col items-center justify-evenly min-h-screen py-10 gap-8">
      {user ? (
        <>
          <div className="text-center">
            <h1 className="text-3xl font-bold">ANNOUNCEMENTS</h1>
            <p className="pt-2 text-md md:text-lg text-muted-foreground">
              ยินดีต้อนรับสู่ Quaso!
            </p>
          </div>
          <Announcement {...user} />
        </>
      ) : (
        <Landing />
      )}
    </div>
  )
}

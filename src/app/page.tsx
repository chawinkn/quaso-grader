import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getServerUser } from '@/lib/session'
import Announcement from '@/components/announcement/Announcement'
import { Badge } from '@/components/ui/badge'
import { cx } from 'class-variance-authority'
import { promises as fs } from 'fs'

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
    <div
      className={cx(
        'flex flex-col items-center min-h-screen py-10 gap-8',
        !user ? 'justify-center' : ''
      )}
    >
      {user ? (
        <>
          <div className="text-center">
            <h1 className="text-3xl font-bold">ANNOUNCEMENTS</h1>
            <p className="pt-2 text-md text-muted-foreground">
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

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getServerUser } from '@/lib/session'
import Announcement from '@/components/announcement/Announcement'
import { cx } from 'class-variance-authority'
import Image from 'next/image'

function Landing() {
  return (
    <div className="text-center flex flex-col items-center">
      <Image
        src="/quawaii.webp"
        width={500}
        height={150}
        quality={100}
        alt="quaso logo"
        style={{ marginBottom: '5px' }}
      />
      <h1
        className="text-4xl font-black md:text-6xl
        bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent "
      >
        Quaso Grader
      </h1>
      <p className="pt-2 text-xl md:text-2xl text-muted-foreground">
        ระบบตรวจและประเมินผลโปรแกรมออนไลน์
      </p>

      <div className="flex-row mt-6 space-x-5">
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
        'flex flex-col items-center min-h-[calc(100vh-57px)]',
        !user ? 'justify-center' : 'py-10 gap-8'
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

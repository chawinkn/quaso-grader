import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getServerUser } from '@/lib/session'
import Announcement from '@/components/Announcement'
import { Croissant, CroissantIcon } from 'lucide-react'

function Landing(){
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
      {user ? <>
                <div className="w-full h-full text-center">
                  <h1 className='text-5xl '>Welcome to Quaso!</h1>
                  <p className='text-muted-foreground text-lg'>โคตรหิว</p>
                </div>
                <Announcement {...user} />
              </> : <Landing/>}
    </div>
  )
}

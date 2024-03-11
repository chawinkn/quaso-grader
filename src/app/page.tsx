import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen py-10">
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
    </div>
  )
}

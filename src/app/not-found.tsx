import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-8xl font-bold">404</h1>
      <p className="text-lg mt-2">Page not found</p>
      <Link href="/">
        <Button className="mt-10">
          Back to homepage <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  )
}

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export default function StatementLayout() {
  return (
    <article className='w-full h-full'>
      <div className="flex justify-center space-x-1 pb-4">
        <Link
          href="https://qccwwndtp6owt1wz.public.blob.vercel-storage.com/a_mul_b-qmwk2kuHbRIECVuas5knSlRQkFiMRe.pdf"
          target="_blank"
          className="underline inline"
        >
          Open Statement
        </Link>
        <ExternalLink />
      </div>
      <iframe
        src="https://qccwwndtp6owt1wz.public.blob.vercel-storage.com/a_mul_b-qmwk2kuHbRIECVuas5knSlRQkFiMRe.pdf"
        width="100%"
        height="100%"
      />
    </article>
  )
}

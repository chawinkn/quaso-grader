import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export default function StatementLayout({ id }: { id: string }) {
  return (
    <article className="min-h-[calc(100vh-57px)]">
      <div className="flex justify-center space-x-1 pb-5">
        <Link
          href={`/api/statement/${id}`}
          target="_blank"
          className="underline inline"
        >
          Open Statement
        </Link>
        <ExternalLink />
      </div>
      <iframe src={`/api/statement/${id}`} width="100%" height="100%" />
    </article>
  )
}

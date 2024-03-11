import { PoweredByVercel, GithubIcon } from '@/svg/Logo'
import Link from 'next/link'

export default function Footer() {
  return (
    <div className="z-50 flex flex-col px-8 py-5 text-sm border-t md:py-3 md:px-16 lg:px-24 bg-background">
      <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
        <p>Crafted by 👩‍💻🤓👾</p>
        <div className="flex flex-row items-center mt-5 space-x-5 md:mt-0">
          <Link href="https://github.com/chawinkn/grader-project">
            <GithubIcon />
          </Link>
          <Link href="https://vercel.com">
            <PoweredByVercel />
          </Link>
        </div>
      </div>
    </div>
  )
}

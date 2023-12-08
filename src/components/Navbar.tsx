'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ThemeButton } from './Themebutton'
import { Menu } from 'lucide-react'

export function NavigationBar() {
  const pathname = usePathname()
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const username = 'admin'

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen)
  }

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen)
  }

  return (
    <>
      <nav className="px-2 py-3 border-b">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/problems" className="text-lg font-bold">
              Home
            </Link>
            <Link href="/problems" className="hidden sm:inline-block">
              Problems
            </Link>
            <Link href="/submissions" className="hidden sm:inline-block">
              Submissions
            </Link>
            <Link href="/scoreboard" className="hidden sm:inline-block">
              Scoreboard
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeButton />
            <Link href={`/profile/${username}`} className="hidden sm:flex">
              {username}
            </Link>
            <button className="hidden sm:flex text-red-500">Logout</button>
            <button onClick={toggleMenu} className="sm:hidden">
              <Menu className="h-[1.5rem] w-[1.5rem] scale-100" />
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="sm:hidden border-b mb-5">
          <div className="container mx-auto pl-10 py-2">
            {/* <button className="py-2" onClick={toggleDropdown}>
              <p>Manage</p>
            </button>
            {isDropdownOpen && (
              <Link href="/problems/create" className="block pl-5 py-2">
                - Create Problem
              </Link>
            )} */}
            <Link href="/problems" className="block py-2">
              Problems
            </Link>
            <Link href="/submissions" className="block py-2">
              Submissions
            </Link>
            <Link href="/scoreboard" className="block py-2">
              Scoreboard
            </Link>
            <Link href={`/profile/${username}`} className="block py-2">
              Profile
            </Link>
            <button className="text-red-500 py-2">Logout</button>
          </div>
        </div>
      )}
    </>
  )
}

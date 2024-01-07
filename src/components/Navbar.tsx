'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ThemeButton } from './Themebutton'
import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

export function NavigationBar() {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const username = 'admin'

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <div className="z-50 flex items-center px-4 py-2 text-sm font-medium border-b bg-background">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/problems" legacyBehavior passHref>
                <NavigationMenuLink className="px-2">Home</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden sm:flex">
              <Link href="/problems" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Problems
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden sm:flex">
              <Link href="/submissions" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Submissions
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden sm:flex">
              <Link href="/scoreboard" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Scoreboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center ml-auto">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <ThemeButton />
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden sm:flex">
                <Link href={`/profile/${username}`} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {username}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button className="hidden px-2 text-red-500 sm:flex">
                  Logout
                </button>
                <Button
                  onClick={toggleMenu}
                  variant="outline"
                  size="icon"
                  className="border-0 sm:hidden"
                >
                  {!isMenuOpen ? (
                    <Menu className="h-[1.5rem] w-[1.5rem] scale-100" />
                  ) : (
                    <X className="h-[1.5rem] w-[1.5rem] scale-100" />
                  )}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-background"></div>
          <div className="z-50 flex flex-col items-start p-6 space-y-4 text-sm">
            <Link href="/problems">Problems</Link>
            <Link href="/submissions">Submissions</Link>
            <Link href="/scoreboard">Scoreboard</Link>
            <Link href={`/profile/${username}`} legacyBehavior passHref>
              Profile
            </Link>
            <button className="text-sm font-medium text-red-500">Logout</button>
          </div>
        </>
      )}
    </>
    // <>
    //   <nav className="px-2 py-3 border-b">
    //     <div className="container flex items-center justify-between mx-auto">
    //       <div className="flex items-center space-x-4">
    //         <Link href="/problems" className="text-lg font-bold">
    //           Home
    //         </Link>
    //         <Link href="/problems" className="hidden sm:inline-block">
    //           Problems
    //         </Link>
    //         <Link href="/submissions" className="hidden sm:inline-block">
    //           Submissions
    //         </Link>
    //         <Link href="/scoreboard" className="hidden sm:inline-block">
    //           Scoreboard
    //         </Link>
    //       </div>

    //       <div className="flex items-center space-x-4">
    // <ThemeButton />
    // <Link href={`/profile/${username}`} className="hidden sm:flex">
    //   {username}
    // </Link>
    // <button className="hidden text-red-500 sm:flex">Logout</button>
    // <button onClick={toggleMenu} className="sm:hidden">
    //   <Menu className="h-[1.5rem] w-[1.5rem] scale-100" />
    // </button>
    //       </div>
    //     </div>
    //   </nav>

    //   {isMenuOpen && (
    //     <div className="mb-5 border-b sm:hidden">
    //       <div className="container py-2 pl-10 mx-auto">
    //         {/* <button className="py-2" onClick={toggleDropdown}>
    //           <p>Manage</p>
    //         </button>
    //         {isDropdownOpen && (
    //           <Link href="/problems/create" className="block py-2 pl-5">
    //             - Create Problem
    //           </Link>
    //         )} */}
    //         <Link href="/problems" className="block py-2">
    //           Problems
    //         </Link>
    //         <Link href="/submissions" className="block py-2">
    //           Submissions
    //         </Link>
    //         <Link href="/scoreboard" className="block py-2">
    //           Scoreboard
    //         </Link>
    //         <Link href={`/profile/${username}`} className="block py-2">
    //           Profile
    //         </Link>
    //         <button className="py-2 text-red-500">Logout</button>
    //       </div>
    //     </div>
    //   )}
    // </>
  )
}

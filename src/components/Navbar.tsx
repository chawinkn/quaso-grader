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
import { useSession, signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'

export function NavigationBar() {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const { status, data: session } = useSession()
  const router = useRouter()

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen)
  }

  const logOut = (event: React.MouseEvent<HTMLButtonElement>) => {
    toast.success('Logout successfully')
    signOut()
    router.push('/')
  }

  return (
    <>
      <div className="z-50 flex items-center px-8 py-2 text-sm font-medium border-b md:px-16 lg:px-24">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className="px-2">Home</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden sm:flex">
              <Link href="/tasks" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Tasks
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
              {session?.user ? (
                <NavigationMenuItem className="hidden sm:flex">
                  <Link
                    href={`/profile/${session?.user.id}`}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {session?.user.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ) : (
                <></>
              )}
              <NavigationMenuItem>
                {session?.user ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden px-4 mx-2 text-red-500 sm:flex"
                    onClick={logOut}
                  >
                    Logout
                  </Button>
                ) : (
                  <Link href="/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden px-4 mx-2 sm:flex"
                    >
                      Login
                    </Button>
                  </Link>
                )}
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
          <div className="z-50 flex flex-col items-start py-8 text-sm px-9">
            <div className="flex flex-col w-full space-y-3">
              <Link href="/tasks">Tasks</Link>
              <Separator />
              <Link href="/submissions">Submissions</Link>
              <Separator />
              <Link href="/scoreboard">Scoreboard</Link>
              <Separator />
              <Link
                href={`/profile/${session?.user.name}`}
                legacyBehavior
                passHref
              >
                Profile
              </Link>
            </div>
            <div className="w-full mt-10">
              {session?.user ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-500"
                  onClick={logOut}
                >
                  Logout
                </Button>
              ) : (
                <Link href="/login" className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

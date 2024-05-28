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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
      <div className="z-50 sticky top-0 bg-background flex items-center px-8 py-2 text-sm font-medium border-b md:px-16 lg:px-24">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className="px-2">Home</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden md:flex">
              <Link href="/tasks" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Tasks
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden md:flex">
              <Link href="/submissions" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Submissions
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden md:flex">
              <Link href="/scoreboard" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Scoreboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {session?.user.role === 'ADMIN' ? (
              <NavigationMenuItem className="hidden md:flex">
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ) : (
              <></>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center ml-auto">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <ThemeButton />
              </NavigationMenuItem>
              {session?.user ? (
                <NavigationMenuItem className="hidden md:flex">
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
                    className="hidden px-4 mx-2 text-red-500 md:flex"
                    onClick={logOut}
                  >
                    Logout
                  </Button>
                ) : (
                  <Link href="/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden px-4 mx-2 md:flex"
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </NavigationMenuItem>
              <NavigationMenuItem className="visible md:hidden">
                <Sheet>
                  <SheetTrigger>
                    <Button className="p-2" variant={'ghost'}>
                      <Menu />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="flex flex-col gap-6">
                    <Link href="/">Home</Link>
                    <Link href="/tasks">Tasks</Link>
                    <Link href="/submissions">Submissions</Link>
                    <Link href="/scoreboard">Scoreboard</Link>
                    {session?.user.role === 'ADMIN' ? (
                      <Link href="/dashboard" className="text-">
                        Dashboard
                      </Link>
                    ) : (
                      <></>
                    )}
                    <Link
                      href={`/profile/${session?.user.id}`}
                      legacyBehavior
                      passHref
                    >
                      Profile
                    </Link>
                    <div className="w-full font-bold">
                      {session?.user ? (
                        <Button
                          variant="ghost"
                          className="p-0 text-md text-left text-red-500"
                          onClick={logOut}
                        >
                          Logout
                        </Button>
                      ) : (
                        <Link href="/login" className="w-full">
                          Login
                        </Link>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </>
  )
}

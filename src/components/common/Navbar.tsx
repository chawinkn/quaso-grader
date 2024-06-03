'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ThemeButton } from '../Themebutton'
import { Menu } from 'lucide-react'
import { Button } from '../ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useSession, signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export function NavigationBar() {
  const [open, setOpen] = useState(false)
  const { status, data: session } = useSession()
  const router = useRouter()

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
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button className="p-2" variant={'ghost'}>
                      <Menu />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="flex flex-col gap-6">
                    <Link
                      href="/"
                      onClick={() => {
                        setOpen(!open)
                      }}
                    >
                      Home
                    </Link>
                    <Link
                      href="/tasks"
                      onClick={() => {
                        setOpen(!open)
                      }}
                    >
                      Tasks
                    </Link>
                    <Link
                      href="/submissions"
                      onClick={() => {
                        setOpen(!open)
                      }}
                    >
                      Submissions
                    </Link>
                    <Link
                      href="/scoreboard"
                      onClick={() => {
                        setOpen(!open)
                      }}
                    >
                      Scoreboard
                    </Link>
                    {session?.user.role === 'ADMIN' ? (
                      <Link
                        href="/dashboard"
                        onClick={() => {
                          setOpen(!open)
                        }}
                        className="text-"
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <></>
                    )}
                    <Link
                      href={`/profile/${session?.user.id}`}
                      onClick={() => {
                        setOpen(!open)
                      }}
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
                        <Link
                          href="/login"
                          onClick={() => {
                            setOpen(!open)
                          }}
                          className="w-full"
                        >
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

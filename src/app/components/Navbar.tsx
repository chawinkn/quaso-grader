'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Dropdown,
  Button,
} from '@nextui-org/react'
import { usePathname } from 'next/navigation'

export function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <Navbar
      isBordered
      isBlurred={false}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="pr-3 sm:hidden" justify="center">
        <NavbarBrand>
          <Link
            href={pathname === '/' ? '#' : '/'}
            className="font-bold text-inherit"
          >
            HOME
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarBrand>
          <Link
            href={pathname === '/' ? '#' : '/'}
            className="font-bold text-inherit"
          >
            HOME
          </Link>
        </NavbarBrand>
        <NavbarItem>
          <Link
            color={pathname.startsWith('/problems') ? 'primary' : 'foreground'}
            href={pathname.startsWith('/problems') ? '#' : '/problems'}
          >
            Problems
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color={
              pathname.startsWith('/submissions') ? 'primary' : 'foreground'
            }
            href={pathname.startsWith('/submissions') ? '#' : '/submissions'}
          >
            Submissions
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color={
              pathname.startsWith('/scoreboard') ? 'primary' : 'foreground'
            }
            href={pathname.startsWith('/scoreboard') ? '#' : '/scoreboard'}
          >
            Scoreboard
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button isIconOnly className="bg-transparent">
            🌙
          </Button>
        </NavbarItem>
        <Dropdown className="hidden sm:flex">
          <NavbarItem>
            <DropdownTrigger>
              <Link color="foreground" className="cursor-pointer">
                username
              </Link>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            color="default"
            itemClasses={{
              base: 'gap-4',
            }}
          >
            <DropdownItem key="dashboard">
              <Link
                className="w-full"
                color="foreground"
                href={pathname.startsWith('/dashboard') ? '#' : '/dashboard'}
              >
                Dashboard
              </Link>
            </DropdownItem>
            <DropdownItem key="logout">
              <Link className="w-full" color="danger" href="#">
                Log Out
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <Link
            color={pathname.startsWith('/problems') ? 'primary' : 'foreground'}
            href={pathname.startsWith('/problems') ? '#' : '/problems'}
          >
            Problems
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            color={
              pathname.startsWith('/submissions') ? 'primary' : 'foreground'
            }
            href={pathname.startsWith('/submissions') ? '#' : '/submissions'}
          >
            Submissions
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            color={
              pathname.startsWith('/scoreboard') ? 'primary' : 'foreground'
            }
            href={pathname.startsWith('/scoreboard') ? '#' : 'scoreboard'}
          >
            Scoreboard
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            color={pathname.startsWith('/dashboard') ? 'primary' : 'foreground'}
            href={pathname.startsWith('/dashboard') ? '#' : 'dashboard'}
          >
            Dashboard
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color="danger" href="#">
            Log Out
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  )
}

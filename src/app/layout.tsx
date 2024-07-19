import type { Metadata } from 'next'
import { Inter, Noto_Sans_Thai } from 'next/font/google'
// import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { ThemeProvider } from '@/components/Themeprovider'
import SessionProvider from '@/components/SessionProvider'
import { getServerSession } from 'next-auth'
import { Toaster } from 'react-hot-toast'
import Footer from '@/components/common/Footer'
import { NavigationBar } from '@/components/common/Navbar'
import { authOptions } from '@/lib/auth'

export const revalidate = 3600

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const notoSans = Noto_Sans_Thai({
  variable: '--font-noto-sans-thai',
  subsets: ['thai'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: '🥐 Quaso Grader',
  description: 'Online programming grader system',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html
      lang="th"
      className={`${inter.variable} ${notoSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <SessionProvider session={session}>
          <Toaster />
          <ThemeProvider
            attribute="class"
            themes={['light', 'dark', 'quaso', 'salad']}
            defaultTheme="system"
            disableTransitionOnChange
          >
            <main className="flex flex-col antialiased bg-background">
              <NavigationBar />
              {children}
              <Footer />
            </main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

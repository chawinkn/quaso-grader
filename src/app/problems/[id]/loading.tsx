import { NavigationBar } from '@/components/Navbar'

export default function Loading() {
  return (
    <>
      <NavigationBar />
      <div className="flex flex-col items-center justify-center h-screen mx-10">
        <p className="animate-pulse text-base">Loading...</p>
      </div>
    </>
  )
}

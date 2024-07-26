import { headers } from 'next/headers'
import CreateAnnouncementCard from './CreateAnnouncementCard'
import AnnouncementCard, { AdminAnnouncementCard } from './AnnouncementCard'
import { AnnouncementData } from './AnnouncementCard'
import { Suspense } from 'react'
import { AnnouncementCardSkeleton } from '../skeletons'

export type UserData = {
  name: string
  id: number
  role: string
}

async function getAnnouncementList() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/announcements`, {
    method: 'GET',
    headers: new Headers(headers()),
  })
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  return data
}

async function AnnouncementComponent({ role }: { role: string }) {
  const announcementList = await getAnnouncementList()

  return announcementList.map((announcement: AnnouncementData) => {
    return (
      <>
        {role === 'ADMIN' ? (
          <AdminAnnouncementCard key={announcement.id} {...announcement} />
        ) : (
          <AnnouncementCard key={announcement.id} {...announcement} />
        )}
      </>
    )
  })
}

export default function Announcement(props: UserData) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      {props.role === 'ADMIN' ? <CreateAnnouncementCard {...props} /> : <></>}
      <Suspense fallback={<AnnouncementCardSkeleton />}>
        <AnnouncementComponent role={props.role} />
      </Suspense>
    </div>
  )
}

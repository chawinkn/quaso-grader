import { headers } from 'next/headers'
import CreateAnnouncementCard from './CreateAnnouncementCard'
import AnnouncementCard, { AdminAnnouncementCard } from './AnnouncementCard'
import { AnnouncementData } from './AnnouncementCard'

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
  if (!res) {
    return null
  }
  const data = await res.json()
  return data
}

async function getUser(userId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
    {
      method: 'GET',
      headers: new Headers(headers()),
    }
  )
  if (!res) {
    return null
  }
  const data = await res.json()
  return data
}

export default async function Announcement(props: UserData) {
  const announcementList = await getAnnouncementList()

  const announcementsWithAuthors = await Promise.all(
    announcementList.map(async (announcement: AnnouncementData) => {
      const user = await getUser(announcement.createdById)
      return { ...announcement, author: user.name }
    })
  )

  return (
    <div className="flex flex-col h-full items-center justify-center gap-4">
      {props.role === 'ADMIN' ? <CreateAnnouncementCard {...props} /> : <></>}
      {announcementsWithAuthors.map((announcement: AnnouncementData) => {
        return (
          <>
            {props.role === 'ADMIN' ? (
              <AdminAnnouncementCard key={announcement.id} {...announcement} />
            ) : (
              <AnnouncementCard key={announcement.id} {...announcement} />
            )}
          </>
        )
      })}
    </div>
  )
}

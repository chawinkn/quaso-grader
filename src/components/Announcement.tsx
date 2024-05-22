import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { headers } from 'next/headers'
import { Separator } from '@/components/ui/separator'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import CreateAnnouncementCard from './CreateAnnouncementCard'
import { getServerUser } from '@/lib/session'

type AnnouncementData = {
  title: string
  content: string
  createdById: number
  author: string
  createdAt: string
}

type UserData = {
  name: string
  id: number
  role: string
}

async function getAnnouncementList() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/announcements`, {
    method: 'GET',
    headers: new Headers(headers()),
  })
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
  const data = await res.json()
  return data
}

function AnnouncementCard(props: AnnouncementData) {
  const createdDate = new Date(props.createdAt)

  return (
    <Card className="w-full lg:w-5/12">
      <div className="p-6 flex flex-row justify-between items-center bg-muted/70">
        <CardTitle>{props.title}</CardTitle>
        <CardDescription className="grow flex flex-row-reverse gap-2 items-center">
          <Badge className="w-max">{props.author}</Badge>
          <Badge variant={'secondary'} className="w-max">
            {createdDate.toLocaleString()}
          </Badge>
        </CardDescription>
      </div>
      <Separator />
      <CardContent className="mt-4">
        <p>{props.content}</p>
      </CardContent>
    </Card>
  )
}

export default async function Announcement(props: UserData) {
  const announcementList = await getAnnouncementList()

  for (const announcement of announcementList) {
    const User = await getUser(announcement.createdById)
    announcement.author = User.username
  }

  return (
    <div className="flex flex-col h-full items-center justify-center gap-4">
      {props.role === 'ADMIN' ? <CreateAnnouncementCard {...props} /> : <></>}
      {announcementList.map((announcement: AnnouncementData) => {
        return (
          <AnnouncementCard key={announcement.createdAt} {...announcement} />
        )
      })}
    </div>
  )
}

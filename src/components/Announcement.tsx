import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Badge } from "@/components/ui/badge"
import { headers } from "next/headers"
import { Separator } from "@/components/ui/separator"
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

type AnnouncementData = {
    title: string,
    content: string,
    createdById: number,
    author: string,
    createdAt: string
}

type UserData = {
    name: string,
    id: number,
    role: string,
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

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be 5-15 characters.' })
    .max(15, { message: 'Title must be 5-15 characters.' }),
  content: z
    .string()
    .max(5000, { message: 'Content must be less than 5000 characters.' }),
})

function createAnnouncement() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })

  return (
    <Card className="w-full lg:w-5/12">
      <div className="p-6 flex flex-row justify-between items-center">
        <CardTitle>{}</CardTitle>
        <CardDescription className="grow flex flex-row-reverse gap-2 items-center">
          <Badge className="w-max">{}</Badge>
          <Badge variant={'secondary'} className="w-max">
            {}
          </Badge>
        </CardDescription>
      </div>
      <Separator />
      <CardContent className="mt-4">
        <p>{}</p>
      </CardContent>
    </Card>
  )
}

function AnnouncementCard(props: AnnouncementData){
    "use client"
    const createdDate = new Date(props.createdAt)
    return (
      <Card className="w-11/12 sm:w-9/12 md:w-8/12 lg:w-5/12 overflow-hidden">
        <div className="p-6 flex flex-row justify-between items-center bg-muted/50">
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
    const postElements = announcementList.map((announcement: AnnouncementData, index: number) => {
        index += 1
        return <AnnouncementCard key={index} {...announcement} />
    });

    return (
        <div className="flex flex-col h-full items-center justify-center gap-4">
            {postElements}
        </div>
    )
}
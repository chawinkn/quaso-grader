import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { headers } from 'next/headers'
import { Separator } from '@/components/ui/separator'
import CreateAnnouncementCard from './CreateAnnouncementCard'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import rehypeExternalLinks from 'rehype-external-links'

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

function AnnouncementCard(props: AnnouncementData) {
  const createdDate = new Date(props.createdAt)

  return (
    <Card className="w-[350px] sm:w-[450px] md:w-[600px] xl:w-[700px]">
      <CardHeader className="flex flex-col md:flex-row justify-between items-center bg-muted/40">
        <CardTitle className="text-xl">{props.title}</CardTitle>
        <div className="grow flex flex-row-reverse gap-2 items-center">
          <Badge className="w-max">{props.author}</Badge>
          <Badge variant="secondary" className="w-max">
            {createdDate.toLocaleString()}
          </Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-6 break-all">
        <Markdown
          className={
            'prose dark:prose-invert text-muted-foreground dark:text-muted-foreground'
          }
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeSanitize,
            [rehypeExternalLinks, { content: { type: 'text', value: '🔗' } }],
          ]}
        >
          {props.content}
        </Markdown>
      </CardContent>
    </Card>
  )
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
          <AnnouncementCard key={announcement.createdAt} {...announcement} />
        )
      })}
    </div>
  )
}

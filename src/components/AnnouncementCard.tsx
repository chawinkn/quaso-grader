'use client'

import { Card, CardTitle, CardContent, CardHeader } from './ui/card'
import { Separator } from './ui/separator'
import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import rehypeExternalLinks from 'rehype-external-links'
import { useRouter } from 'next/navigation'

export type AnnouncementData = {
  id: string
  title: string
  content: string
  createdById: number
  createdBy: {
    name: string
  }
  createdAt: string
}

export function AdminAnnouncementCard(props: AnnouncementData) {
  const router = useRouter()
  const [isSubmit, setSubmit] = useState(false)
  const createdDate = new Date(props.createdAt)

  const onClick = async () => {
    setSubmit(true)
    try {
      const response = await fetch('/api/announcements', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: props.id,
        }),
      })
      const result = await response.json()
      if (response?.ok) {
        toast.success('Delete successfully')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.')
    }
    setSubmit(false)
  }

  return (
    <Card className="w-[350px] sm:w-[450px] md:w-[600px] xl:w-[700px]">
      <CardHeader className="flex flex-col items-center justify-between md:flex-row bg-muted/40">
        <CardTitle className="text-xl">{props.title}</CardTitle>
        <div className="flex flex-row-reverse items-center gap-2 grow">
          <Badge className="w-max">{props.createdBy.name}</Badge>
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
        <Button
          onClick={onClick}
          variant={'destructive'}
          disabled={isSubmit}
          className="w-full mt-4"
        >
          {isSubmit ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <div className="flex flex-row items-center justify-center">
              Delete{' '}
              <span className="ml-2">
                <Trash2 />
              </span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function AnnouncementCard(props: AnnouncementData) {
  const createdDate = new Date(props.createdAt)

  return (
    <Card className="w-[350px] sm:w-[450px] md:w-[600px] xl:w-[700px]">
      <CardHeader className="flex flex-col items-center justify-between md:flex-row bg-muted/40">
        <CardTitle className="text-xl">{props.title}</CardTitle>
        <div className="flex flex-row-reverse items-center gap-2 grow">
          <Badge className="w-max">{props.createdBy.name}</Badge>
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

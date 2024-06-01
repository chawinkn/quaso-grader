'use client'

import { Card, CardTitle, CardContent, CardHeader } from '../ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Separator } from '../ui/separator'
import { Loader2 } from 'lucide-react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'
import { Textarea } from '../ui/textarea'
import { UserData } from './Announcement'

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title must be 1-25 characters.' })
    .max(25, { message: 'Title must be 1-25 characters.' }),
  content: z
    .string()
    .min(1, { message: 'Content must be 1-5000 characters.' })
    .max(5000, { message: 'Content must be 1-5000 characters.' }),
})

export default function CreateAnnouncementCard(props: UserData) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })
  const [isSubmit, setSubmit] = useState(false)

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSubmit(true)
    const { title, content } = data
    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: props.id,
          title,
          content,
        }),
      })
      const result = await response.json()
      if (response?.ok) {
        toast.success('Create successfully')
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
      <CardHeader className="flex flex-col md:flex-row justify-between items-center bg-muted/40">
        <CardTitle className="text-xl">New announcement</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-6 break-all">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      id="editor"
                      placeholder="Content"
                      className="min-h-48"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmit} className="w-full" type="submit">
              {isSubmit ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                'Create'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

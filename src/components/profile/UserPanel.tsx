'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export type UserData = {
  username: string
  name: string
  id: number
  role: string
}

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Username must be 3-30 characters.' })
    .max(30, { message: 'Username must be 3-30 characters.' }),
})

export default function UserPanel(props: UserData) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })
  const [isSubmit, setSubmit] = useState(false)

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSubmit(true)
    const { name } = data
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: props.id,
          name,
        }),
      })
      if (response?.ok) {
        toast.success('Saved successfully')
        router.refresh()
      } else {
        const result = await response.json()
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.')
    }
    setSubmit(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <p className="text-center text-md">{props.name}</p>
              <FormControl>
                <Input placeholder="Display name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmit} className="w-full" type="submit">
          {isSubmit ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            'Save'
          )}
        </Button>
      </form>
    </Form>
  )
}

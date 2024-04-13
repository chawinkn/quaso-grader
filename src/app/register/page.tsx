'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  FormDescription,
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
import { Badge } from '@/components/ui/badge'

const formSchema = z.object({
  username: z
    .string()
    .min(5, { message: 'Username must be 5-15 characters.' })
    .max(15, { message: 'Username must be 5-15 characters.' }),
  inviteCode: z.string(),
  password: z
    .string()
    .min(5, { message: 'Password must be 5-15 characters.' })
    .max(15, { message: 'Password must be 5-15 characters.' }),
})

export default function Register() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      inviteCode: '',
      password: '',
    },
  })
  const [isSubmit, setSubmit] = useState(false)

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSubmit(true)
    const { username, inviteCode, password } = data
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          inviteCode,
          password,
        }),
      })
      if (response?.ok) {
        toast.success('Registration successfully')
        router.push('/login')
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
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Invitation code : <Badge variant="secondary">test</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inviteCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Invitation code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
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
                  'Register'
                )}
              </Button>
            </form>
          </Form>
          <CardDescription className="text-center">
            <Link href="/login">Already have an account?</Link>
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}

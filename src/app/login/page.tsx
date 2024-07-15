'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
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
import { Loader2 } from 'lucide-react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const formSchema = z.object({
  username: z
    .string()
    .min(5, { message: 'Username must be 5-15 characters.' })
    .max(15, { message: 'Username must be 5-15 characters.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be 8-24 characters.' })
    .max(24, { message: 'Password must be 8-24 characters.' }),
})

export default function LogIn() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })
  const [isSubmit, setSubmit] = useState(false)

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSubmit(true)
    const { username, password } = data
    try {
      const response = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })
      if (response?.ok) {
        toast.success('Login successfully')
        router.push('/')
        router.refresh()
      } else {
        toast.error('Invalid username or password, or account not approved.')
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.')
    }
    setSubmit(false)
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-57px)]">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <CardTitle>Grader</CardTitle>
          <CardDescription>Please login to see the tasks</CardDescription>
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
                  'Login'
                )}
              </Button>
            </form>
          </Form>
          <CardDescription className="text-center">
            <Link href="/register">Don't have an account?</Link>
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}

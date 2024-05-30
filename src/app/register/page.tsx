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
import { useState } from 'react'
import toast from 'react-hot-toast'

const formSchema = z
  .object({
    username: z
      .string()
      .min(5, { message: 'Username must be 5-15 characters.' })
      .max(15, { message: 'Username must be 5-15 characters.' }),
    name: z
      .string()
      .min(3, { message: 'Username must be 3-30 characters.' })
      .max(30, { message: 'Username must be 3-30 characters.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be 8-24 characters.' })
      .max(24, { message: 'Password must be 8-24 characters.' }),
    confirm_password: z
      .string()
      .min(8, { message: 'Password must be 8-24 characters.' })
      .max(24, { message: 'Password must be 8-24 characters.' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match.',
    path: ['confirm_password'],
  })

export default function Register() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      name: '',
      password: '',
      confirm_password: '',
    },
  })
  const [isSubmit, setSubmit] = useState(false)

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSubmit(true)
    const { username, name, confirm_password, password } = data
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          name,
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Display name" {...field} />
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
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Confirm Password"
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

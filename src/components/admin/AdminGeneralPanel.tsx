'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Checkbox } from '../ui/checkbox'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

const formSchema = z.object({
  placeholder: z.string().min(2).max(50),
})

const formApproveSchema = z.object({
  auto_approve: z.string(),
})

const formLangSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
})

const formIntervalSchema = z.object({
  result_interval: z.preprocess(
    (x) => (x ? x : undefined),
    z.coerce
      .number()
      .int()
      .min(1, { message: 'Interval must be 1-10 seconds.' })
      .max(10, { message: 'Interval must be 1-10 seconds.' })
  ),
})

export type Languages = {
  name: string
  language: string
  ext: string
  available: boolean
}

export type Config = {
  languages: Array<Languages>
  auto_approve: boolean
  result_interval: number
}

export default function AdminGeneralPanel({ config }: { config: Config }) {
  const items: Array<{ id: string; label: string }> = config.languages.map(
    (i) => {
      return { id: i.language, label: i.name }
    }
  )
  const defaultLanguages: Array<string> = []
  for (let i = 0; i < config.languages.length; i++) {
    if (config.languages[i].available)
      defaultLanguages.push(config.languages[i].language)
  }

  const formApprove = useForm<z.infer<typeof formApproveSchema>>({
    resolver: zodResolver(formApproveSchema),
    defaultValues: {
      auto_approve: config.auto_approve ? 'YES' : 'NO',
    },
  })

  const formInterval = useForm<z.infer<typeof formIntervalSchema>>({
    resolver: zodResolver(formIntervalSchema),
    defaultValues: {
      result_interval: config.result_interval,
    },
  })

  const formLang = useForm<z.infer<typeof formLangSchema>>({
    resolver: zodResolver(formLangSchema),
    defaultValues: {
      items: defaultLanguages,
    },
  })

  return (
    <Card className="min-w-max w-[350px] sm:w-[450px] md:w-[600px] xl:w-[700px] h-max">
      <CardHeader>
        <CardTitle>General</CardTitle>
        <CardDescription>Edit your general config in .env</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...formApprove}>
          <form className="space-y-4">
            <FormField
              control={formApprove.control}
              name="auto_approve"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auto Approve</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Auto Approve" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="YES">YES</SelectItem>
                      <SelectItem value="NO">NO</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Auto approve new register user
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Form {...formLang}>
          <form className="space-y-4">
            <FormField
              control={formLang.control}
              name="items"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Languages</FormLabel>
                  </div>
                  {items.map((item) => (
                    <FormField
                      key={item.id}
                      control={formLang.control}
                      name="items"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                disabled
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Form {...formInterval}>
          <form className="space-y-4">
            <FormField
              control={formInterval.control}
              name="result_interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Result interval</FormLabel>
                  <FormControl>
                    <Input placeholder="Result interval" disabled {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Submission result fetching interval (In seconds)
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}

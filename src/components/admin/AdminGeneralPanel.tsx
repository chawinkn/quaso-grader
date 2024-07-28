'use client'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { languages } from '@/utils/generalConfig'

const formSchema = z.object({
  placeholder: z.string().min(2).max(50),
})

const formApproveSchema = z.object({
  approval_required: z.string(),
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
      .min(1, { message: 'Interval must be 1-10 seconds.' })
      .max(10, { message: 'Interval must be 1-10 seconds.' })
  ),
})

export type Languages = {
  name: string
  language: string
  ext: string
  compile: string
  run: string
  available: boolean
}

export default function AdminGeneralPanel({ ...props }) {
  const config = props?.config
  const [isSaveLang, setSaveLang] = useState(false)
  const [isSaveApprove, setSaveApprove] = useState(false)
  const [isSaveInterval, setSaveInterval] = useState(false)
  const router = useRouter()

  const languagesItems: Array<{ id: string; label: string }> = languages.map(
    (i) => {
      return { id: i.language, label: i.name }
    }
  )
  const defaultLanguages: Array<string> = []
  const available_language_split = config?.available_language.split(',')
  languages.forEach((lang) => {
    if (available_language_split.includes(lang.language)) {
      defaultLanguages.push(lang.language)
    }
  })
  const formApprove = useForm<z.infer<typeof formApproveSchema>>({
    resolver: zodResolver(formApproveSchema),
    defaultValues: {
      approval_required: config?.approval_required,
    },
  })

  const formInterval = useForm<z.infer<typeof formIntervalSchema>>({
    resolver: zodResolver(formIntervalSchema),
    defaultValues: {
      result_interval: config?.result_interval,
    },
  })

  const formLang = useForm<z.infer<typeof formLangSchema>>({
    resolver: zodResolver(formLangSchema),
    defaultValues: {
      items: defaultLanguages,
    },
  })

  const onSubmit = async (data: z.infer<typeof formApproveSchema>) => {
    setSaveApprove(true)
    const { approval_required } = data
    try {
      const res = await fetch('/api/config/approval_required', {
        method: 'PUT',
        body: JSON.stringify({ value: approval_required }),
      })
      if (!res?.ok) {
        setSaveApprove(false)
        const result = await res.json()
        return toast.error(result.error)
      }
      toast.success('approval_required saved successfully')
      router.refresh()
    } catch (error: any) {
      setSaveApprove(false)
      return toast.error(error.message)
    }
    setSaveApprove(false)
  }

  const onSubmitLang = async (data: z.infer<typeof formLangSchema>) => {
    setSaveLang(true)
    const { items } = data
    try {
      const res = await fetch('/api/config/available_language', {
        method: 'PUT',
        body: JSON.stringify({ value: items.join(',') }),
      })
      if (!res?.ok) {
        setSaveLang(false)
        const result = await res.json()
        return toast.error(result.error)
      }
      toast.success('available_language saved successfully')
      router.refresh()
    } catch (error: any) {
      setSaveLang(false)
      return toast.error(error.message)
    }
    setSaveLang(false)
  }

  const onSubmitInterval = async (data: z.infer<typeof formIntervalSchema>) => {
    setSaveInterval(true)
    const { result_interval } = data
    try {
      const res = await fetch('/api/config/result_interval', {
        method: 'PUT',
        body: JSON.stringify({ value: String(result_interval) }),
      })
      if (!res?.ok) {
        setSaveInterval(false)
        const result = await res.json()
        return toast.error(result.error)
      }
      toast.success('result_interval saved successfully')
      router.refresh()
    } catch (error: any) {
      setSaveInterval(false)
      return toast.error(error.message)
    }
    setSaveInterval(false)
  }

  return (
    <Card className="min-w-max w-[350px] sm:w-[450px] md:w-[600px] xl:w-[700px] h-max">
      <CardHeader>
        <CardTitle>General</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...formApprove}>
          <form
            className="space-y-4"
            onSubmit={formApprove.handleSubmit(onSubmit)}
          >
            <FormField
              control={formApprove.control}
              name="approval_required"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>approval_required</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="approval_required" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Is manual approve new registered user?
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button disabled={isSaveApprove} type="submit">
              {isSaveApprove ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                'Save'
              )}
            </Button>
          </form>
        </Form>
        <Form {...formLang}>
          <form
            className="space-y-4"
            onSubmit={formLang.handleSubmit(onSubmitLang)}
          >
            <FormField
              control={formLang.control}
              name="items"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>available_language</FormLabel>
                    <FormDescription>
                      Available languages for submission
                    </FormDescription>
                  </div>
                  {languagesItems.map((item) => (
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
            <Button disabled={isSaveLang} type="submit">
              {isSaveLang ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                'Save'
              )}
            </Button>
          </form>
        </Form>
        <Form {...formInterval}>
          <form
            className="space-y-4"
            onSubmit={formInterval.handleSubmit(onSubmitInterval)}
          >
            <FormField
              control={formInterval.control}
              name="result_interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>result_interval</FormLabel>
                  <FormControl>
                    <Input placeholder="Result interval" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Submission result fetching interval (In seconds)
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button disabled={isSaveInterval} type="submit">
              {isSaveInterval ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                'Save'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}

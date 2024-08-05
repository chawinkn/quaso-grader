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
import toast from 'react-hot-toast'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Label } from '../ui/label'
import { useRouter } from 'next/navigation'
import { Switch } from '../ui/switch'
import { Textarea } from '../ui/textarea'
import JSZip from 'jszip'

type Manifest = {
  time_limit: number
  memory_limit: number
  checker: string
  skip: boolean
  full_score: number
  num_testcases: number
  subtasks: Array<{ full_score: number; num_testcases: number }>
}

export default function CreateTaskLayout({ groupId }: { groupId: string }) {
  const [isSubmit, setSubmit] = useState(false)
  const [numSubtasks, setnumSubtasks] = useState(0)
  const [numTestcases, setnumTestcases] = useState(0)
  const [manualTestcases, setmanualTestcases] = useState(false)
  const router = useRouter()

  let formSchema = z.object({
    id: z
      .string()
      .regex(/^[a-z0-9_]+$/, {
        message: 'Only lowercase, numbers and underscore',
      })
      .min(3, { message: 'Task id must be 3-25 characters.' })
      .max(20, { message: 'Task id must be 3-25 characters.' }),
    title: z
      .string()
      .min(3, { message: 'Task title must be 3-45 characters.' })
      .max(40, { message: 'Task title must be 3-45 characters.' }),
    time_limit: z.preprocess(
      (x) => (x ? x : undefined),
      z.coerce
        .number()
        .min(0.25, { message: 'Time limit must be 0.25-5 seconds.' })
        .max(5, { message: 'Time limit must be 0.25-5 seconds.' })
    ),
    memory_limit: z.preprocess(
      (x) => (x ? x : undefined),
      z.coerce
        .number()
        .int()
        .min(4, { message: 'Memory limit must be 4-512 MB.' })
        .max(512, { message: 'Memory limit must be 4-512 MB.' })
    ),
    num_testcases: z.preprocess(
      (x) => (x ? x : undefined),
      z.coerce
        .number()
        .int()
        .min(1, { message: 'Num testcases must be at least 1.' })
    ),
    checker: z.string(),
    skip: z.string(),
    full_score: z.preprocess(
      (x) => (x ? x : undefined),
      z.coerce
        .number()
        .int()
        .min(0, { message: 'Full score must be at least 0 points.' })
    ),
    description: z
      .any()
      .refine((files) => files?.length == 1, 'File is required.')
      .refine(
        (files) => files?.[0]?.size <= 5 * 1024 * 1024,
        `Max file size is 5 MB.`
      )
      .refine(
        (files) => ['application/pdf'].includes(files?.[0]?.type),
        'Only .pdf is accepted.'
      ),
    testcases: z
      .any()
      .optional()
      .refine(
        (files) => (!manualTestcases ? files?.length === 1 : true),
        'File is required.'
      )
      .refine(
        (files) =>
          !manualTestcases ? files?.[0]?.size <= 10 * 1024 * 1024 : true,
        'Max file size is 10 MB.'
      )
      .refine(
        (files) =>
          !manualTestcases
            ? ['application/zip', 'application/x-zip-compressed'].includes(
                files?.[0]?.type
              )
            : true,
        'Only .zip is accepted.'
      ),
    subtasks: z.array(
      z.object({
        full_score: z.coerce
          .number()
          .int()
          .min(0, { message: 'Full score must be at least 0 points.' }),
        num_testcases: z.coerce
          .number()
          .int()
          .min(1, { message: 'Num testcases must be at least 1.' }),
      })
    ),
    testcase: z.array(
      z.object({
        input: z.string(),
        output: z.string(),
      })
    ),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      time_limit: 1,
      memory_limit: 32,
      checker: 'TEXT',
      skip: 'NO',
      full_score: 100,
      subtasks: [],
      testcase: [],
    },
  })

  const descriptionRef = form.register('description')
  const testcasesRef = form.register('testcases')

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSubmit(true)
    const {
      id,
      title,
      time_limit,
      memory_limit,
      num_testcases,
      checker,
      skip,
      full_score,
      description,
      testcases,
      subtasks,
      testcase,
    } = data

    if (subtasks?.length) {
      const totalSubtaskTestcases = subtasks.reduce(
        (sum, subtask) => sum + subtask.num_testcases,
        0
      )
      const totalSubtaskScores = subtasks.reduce(
        (sum, subtask) => sum + subtask.full_score,
        0
      )

      if (totalSubtaskTestcases !== num_testcases) {
        toast.error(
          'Sum of subtask testcases must be equal to total testcases.'
        )
        setSubmit(false)
        return
      }

      if (totalSubtaskScores !== full_score) {
        toast.error('Sum of subtask scores must be equal to total score.')
        setSubmit(false)
        return
      }
    }

    const manifest: Manifest = {
      time_limit: Number(time_limit),
      memory_limit: Number(memory_limit),
      checker: checker === 'TEXT' ? 'lcmp' : 'rcmp6',
      skip: skip === 'YES',
      full_score: Number(full_score),
      num_testcases: Number(num_testcases),
      subtasks: subtasks
        ? subtasks.map((st) => ({
            full_score: Number(st.full_score),
            num_testcases: Number(st.num_testcases),
          }))
        : [],
    }

    const formData = new FormData()
    const manifestBlob = new Blob([JSON.stringify(manifest)], {
      type: 'application/json',
    })
    formData.append('manifest', manifestBlob, 'manifest.json')
    formData.append('desc', description[0], 'desc.pdf')
    if (!manualTestcases) {
      formData.append('testcases', testcases[0], 'testcases.zip')
    } else {
      const testcaseFile = Array()
      testcase.forEach((i, index) => {
        const inFile = new File([i.input], `${index + 1}.in`)
        const solFile = new File([i.output], `${index + 1}.sol`)
        testcaseFile.push(inFile)
        testcaseFile.push(solFile)
      })
      const zip = new JSZip()
      testcaseFile.forEach((file) => {
        zip.file(file.name, file)
      })
      const zipTestcase = await zip.generateAsync({ type: 'blob' })
      if (zipTestcase.size > 10 * 1024 * 1024) {
        return toast.error(
          `Size ${zipTestcase.size} bytes, Max zipped testcases size is 10 MB.`
        )
      }
      formData.append('testcases', zipTestcase, 'testcases.zip')
    }
    formData.append('id', id)
    formData.append('title', title)
    formData.append('fullScore', String(full_score))
    formData.append('groupId', groupId)

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        body: formData,
      })
      if (!res?.ok) {
        setSubmit(false)
        const result = await res.json()
        return toast.error(result.error)
      }
      toast.success('Task created successfully')
      router.push(`/dashboard/tasks`)
      router.refresh()
    } catch (error: any) {
      setSubmit(false)
      return toast.error(error.message)
    }
    setSubmit(false)
  }

  const handleManualChange = () => {
    setnumTestcases(0)
    setmanualTestcases(!manualTestcases)
  }

  return (
    <Card className="w-[350px] sm:w-[450px] md:w-[700px] xl:w-[800px]">
      <CardHeader>
        <CardTitle>Create Task</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task id</FormLabel>
                  <FormControl>
                    <Input placeholder="Task id" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Only lowercase, numbers and underscore (Cannot change later)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="full_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full score</FormLabel>
                  <FormControl>
                    <Input placeholder="Full score" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time limit</FormLabel>
                  <FormControl>
                    <Input placeholder="Time limit" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>In seconds</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="memory_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Memory limit</FormLabel>
                  <FormControl>
                    <Input placeholder="Memory limit" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>In MB</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statement</FormLabel>
                  <Input
                    id="description"
                    type="file"
                    accept=".pdf"
                    className="transition-transform cursor-pointer active:scale-95"
                    {...descriptionRef}
                  />
                  <FormMessage />
                  <FormDescription>
                    In .pdf (Max file size is 5 MB)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="testcases"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Testcases</FormLabel>
                  <div className="flex items-center my-2 space-x-4">
                    <Switch onClick={handleManualChange} />
                    <Label>Manual testcases</Label>
                  </div>
                  <FormDescription>
                    For simple testcases at most 10 testcases and limit content
                    size
                  </FormDescription>
                  <Input
                    id="testcases"
                    type="file"
                    accept=".zip"
                    className="transition-transform cursor-pointer active:scale-95"
                    disabled={manualTestcases}
                    {...testcasesRef}
                  />
                  <FormMessage />
                  <FormDescription>
                    In .zip (Max file size is 10 MB). It must include inputs and
                    solutions (eg. 1.in, 1.sol, 2.in, 2.sol)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="num_testcases"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Num testcases</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Num testcases"
                      onChangeCapture={(event) => {
                        const value = Number(event.currentTarget.value)
                        if (!manualTestcases) {
                          setnumTestcases(0)
                          return
                        }
                        if (value < 0 || value > 10) {
                          toast.error('Num testcases must be 1-10.')
                          setnumTestcases(0)
                          return
                        }
                        setnumTestcases(value)
                        const testcase = Array.from({ length: value }, () => ({
                          input: '',
                          output: '',
                        }))
                        form.setValue('testcase', testcase)
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {Array.from({ length: numTestcases }, (_, index) => (
              <div key={index} className="space-y-2">
                <Label>Testcase {index + 1}</Label>
                <div className="flex flex-row space-x-2">
                  <FormField
                    control={form.control}
                    name={`testcase.${index}.input`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Textarea
                            placeholder="Input"
                            className="min-h-48"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`testcase.${index}.output`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Textarea
                            placeholder="Output"
                            className="min-h-48"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            <FormField
              control={form.control}
              name="checker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Checker</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Checker" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TEXT">TEXT</SelectItem>
                      <SelectItem value="FLOAT">FLOAT</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="flex flex-col space-y-1">
                    <span>TEXT: lines, ignores whitespaces </span>
                    <span>FLOAT: numbers, maximum error 10^-6 </span>
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skip</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={numSubtasks === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Skip" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="YES">YES</SelectItem>
                      <SelectItem value="NO">NO</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="flex flex-col space-y-1">
                    <span>
                      Skip when judging results in a wrong Answer within each
                      subtask
                    </span>
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label>Subtasks</Label>
              <Input
                id="num_subtasks"
                type="number"
                placeholder="Num subtasks"
                defaultValue={0}
                onChange={(event) => {
                  const value = Number(event.currentTarget.value)
                  setnumSubtasks(value)
                  const subtasks = Array.from({ length: value }, () => ({
                    full_score: NaN,
                    num_testcases: NaN,
                  }))
                  form.setValue('subtasks', subtasks)
                }}
              ></Input>
              <FormDescription className="flex flex-col space-y-1">
                <span>Leave 0 for no subtasks</span>
              </FormDescription>
              {Array.from({ length: numSubtasks }, (_, index) => (
                <div key={index} className="space-y-2">
                  <Label>Subtask {index + 1}</Label>
                  <div className="flex flex-row space-x-2">
                    <FormField
                      control={form.control}
                      name={`subtasks.${index}.full_score`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input
                              placeholder="Full score"
                              type="number"
                              min={0}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`subtasks.${index}.num_testcases`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input
                              placeholder="Num testcases"
                              type="number"
                              min={1}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
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
      <CardFooter></CardFooter>
    </Card>
  )
}

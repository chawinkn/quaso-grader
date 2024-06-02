'use client'

import Editor from '@monaco-editor/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '../ui/card'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { TaskData } from '@/app/tasks/columns'
import StatementLayout from '../Statementlayout'

export default function EditTaskLayout({ ...props }) {
  const task: TaskData = props?.task
  const [fileInputColor, setfileInputColor] = useState('')
  const [isSubmit, setSubmit] = useState(false)
  const router = useRouter()
  const languageList = [
    {
      ext: 'zip',
    },
    {
      ext: 'in',
    },
    {
      ext: 'sol',
    },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    const name = file?.name
    const ext = name?.substring(name.lastIndexOf('.') + 1) as string
    const isExist = languageList.map((lang) => lang.ext).includes(ext)

    if (!isExist || !file) {
      event.target.value = ''
      setfileInputColor('!border-red-500')
      return
    }

    setfileInputColor('')
  }

  const handleSubmit = async () => {
    setSubmit(true)
    try {
      toast.success('Upload successfully')
      // const response = await fetch('/api/submissions', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     taskId: task.id,
      //     sourcecode,
      //     language,
      //   }),
      // })
      // const result = await response.json()
      // if (response?.ok) {
      //   toast.success('Submit successfully')
      //   router.push(`/submissions/${result.id}`)
      // } else {
      //   toast.error(result.error)
      // }
    } catch (error) {
      console.log(error)
      toast.error('An unexpected error occurred. Please try again later.')
    }
    setSubmit(false)
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 grow">
      <h2 className="text-3xl font-bold">{task.title}</h2>
      <h2 className="text-lg">{task.id}</h2>
      <div className="flex flex-col mt-10 space-y-4 grow lg:flex-row lg:space-x-2">
        <div className="flex flex-col space-y-5">
          <Input
            id="sourcecode"
            type="file"
            accept=".zip,.in,.out"
            multiple
            onChange={handleFileUpload}
            className={`${fileInputColor} transition-transform active:scale-95 cursor-pointer`}
          />
          <div className="flex flex-row space-x-4">
            <Button
              disabled={isSubmit}
              className="w-1/2"
              onClick={handleSubmit}
            >
              {isSubmit ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

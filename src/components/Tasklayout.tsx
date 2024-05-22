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
import { Card } from './ui/card'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import StatementLayout from './Statementlayout'

type TaskData = {
  title: string
  id: string
  passCount: number
  score: number
}

export default function TaskLayout({ ...props }) {
  const task: TaskData = props?.task
  const [language, setLanguauge] = useState('')
  const [sourcecode, setSourcecode] = useState('')
  const [fileInputColor, setfileInputColor] = useState('')
  const [isSubmit, setSubmit] = useState(false)
  const router = useRouter()
  const languageList = [
    {
      name: 'C',
      language: 'c',
      ext: 'c',
    },
    {
      name: 'C++',
      language: 'cpp',
      ext: 'cpp',
    },
    {
      name: 'Python',
      language: 'python',
      ext: 'py',
    },
  ]

  const handleLanguage = (value: string) => {
    setLanguauge(value)
  }

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

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setSourcecode(content)
    }
    reader.readAsText(file)

    if (ext == 'py') {
      setLanguauge('python')
    } else {
      setLanguauge(ext)
    }
  }

  const handleEditorChange = (value: string | any) => {
    setSourcecode(value)
  }

  const handleSubmit = async () => {
    setSubmit(true)
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        body: JSON.stringify({
          taskId: task.id,
          sourcecode,
          language,
        }),
      })
      const result = await response.json()
      if (response?.ok) {
        toast.success('Submit successfully')
        router.push(`/submissions/${result.id}`)
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.log(error)
      toast.error('An unexpected error occurred. Please try again later.')
    }
    setSubmit(false)
  }

  return (
    <div className="grow flex flex-col items-center justify-center py-10">
      <h2 className="text-3xl font-bold">{task.title}</h2>
      <div className="px-4 lg:px-8 w-full md:w-4/5 my-5 space-y-4 min-h-[500px] xl:h-[75vh] 2xl:h-screen sm:space-x-4">
        <StatementLayout />
      </div>
      <div className="grow flex flex-col mt-5 space-y-4 lg:flex-row-reverse sm:space-x-4">
        <Card className="w-[350px] sm:w-[500px] xl:w-[700px] 2xl:w-[800px] h-[600px] overflow-hidden my-4 lg:mx-8">
          <Editor
            language={language}
            value={sourcecode}
            theme="vs-dark"
            height={'100%'}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              fontLigatures: true,
            }}
            className="caret-transparent monaco-font"
            onChange={handleEditorChange}
          />
        </Card>
        <div className="flex flex-col space-y-5">
          <Input
            id="sourcecode"
            type="file"
            accept=".c,.cpp,.py"
            onChange={handleFileUpload}
            className={`${fileInputColor} transition-transform active:scale-95 cursor-pointer`}
          />
          <div className="flex flex-row space-x-4">
            <Select value={language} onValueChange={handleLanguage}>
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languageList.map((lang) => (
                  <SelectItem key={lang.name} value={lang.language}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              disabled={!(sourcecode && language) || isSubmit}
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

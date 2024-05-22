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
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { ExternalLink } from 'lucide-react'
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
      if (response?.ok) {
        toast.success('Submit successfully')
        revalidatePath('/submissions')
        router.push('/submissions')
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
    <div className="flex flex-col items-center justify-center py-10">
      <p className="font-bold">{task.title}</p>
      <p>{task.id}</p>
      <div className="mt-5 space-y-4">
        <StatementLayout />
        <Card className="w-[350px] sm:w-[450px] md:w-[550px] lg:w-[650px] xl:w-[750px] h-[300px] md:h-[500px] overflow-hidden">
          <Editor
            language={language}
            value={sourcecode}
            theme="vs-dark"
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
            className={fileInputColor}
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

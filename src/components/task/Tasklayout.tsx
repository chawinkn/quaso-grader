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
import { languages } from '@/utils/generalConfig'

export default function TaskLayout({ ...props }) {
  const task: TaskData = props?.task
  const config = props?.config
  const [language, setLanguauge] = useState('')
  const [sourcecode, setSourcecode] = useState('')
  const [fileInputColor, setfileInputColor] = useState('')
  const [isSubmit, setSubmit] = useState(false)
  const router = useRouter()
  const languageList: Array<{ name: string; language: string; ext: string }> =
    []
  const available_language_split = config.available_language.split(',')
  languages.forEach((lang) => {
    if (available_language_split.includes(lang.language)) {
      languageList.push({
        name: lang.name,
        language: lang.language,
        ext: lang.ext,
      })
    }
  })
  const handleLanguage = (value: string) => {
    setLanguauge(value)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file?.size > 1024 * 25) {
        event.target.value = ''
        return toast.error('File size must be less than 25KB')
      }
    }
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

    setLanguauge(ext)
  }

  const handleEditorChange = (value: string | any) => {
    setSourcecode(value)
  }

  const handleSubmit = async () => {
    setSubmit(true)
    const blob = new Blob([sourcecode], { type: 'text/plain;charset=utf-8' })
    if (blob.size > 1024 * 25) {
      setSubmit(false)
      return toast.error('Text size must be less than 25KB')
    }

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        body: JSON.stringify({
          taskId: task.id,
          sourcecode,
          language,
        }),
      })
      const result = await res.json()
      if (!res?.ok) {
        setSubmit(false)
        return toast.error(result.error)
      }
      toast.success('Submitted successfully')
      router.push(`/submissions/${result.id}`)
    } catch (error: any) {
      setSubmit(false)
      return toast.error(error.message)
    }
    setSubmit(false)
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 grow">
      <h2 className="text-3xl font-bold">{task.title}</h2>
      <h2 className="text-lg">Full score : {task.fullScore}</h2>
      <div className="w-4/5 my-5 space-y-4 lg:w-4/6 sm:space-x-4">
        <StatementLayout id={task.id} />
      </div>
      <div className="flex flex-col mt-10 space-y-4 grow lg:flex-row lg:space-x-2">
        <Card className="w-[350px] sm:w-[500px] xl:w-[700px] 2xl:w-[800px] h-[500px] overflow-hidden my-4 lg:mx-8">
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
            accept={languageList.map((lang) => lang.ext).join(',')}
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

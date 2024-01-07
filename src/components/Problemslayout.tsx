'use client'

import Editor from '@monaco-editor/react'
import { useTheme } from 'next-themes'
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

type ProblemsData = {
  name: string | null
  problemId: number | null
  passCount: number | null
  score: number | null
}

export default function ProblemsLayout({ ...props }) {
  const problem: ProblemsData = props?.problem
  const { theme } = useTheme()
  const [language, setLanguauge] = useState('')
  const [sourcecode, setSourcecode] = useState('')
  const [fileInputColor, setfileInputColor] = useState('')
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
  }

  const handleEditorChange = (value: string | any) => {
    setSourcecode(value)
  }

  const handleSubmit = async () => {
    const currentTime = new Date()
    const formattedTime = currentTime.toLocaleTimeString()
    alert(`Submitted at ${formattedTime}`)
  }

  return (
    <div className="flex flex-col items-center justify-center lg:py-5">
      <p className="font-bold">{problem.name}</p>
      <p className="text-sm">Time Limit: 1 ms</p>
      <p className="text-sm">Memory: 64 megabytes</p>
      <div className="flex flex-col mt-5 space-y-4 lg:flex-row h-3/4 sm:space-x-4">
        <Card className="w-[350px] sm:w-[500px] xl:w-[700px] h-[400px] overflow-hidden">
          <Editor
            language={language}
            value={sourcecode}
            theme={theme === 'light' ? 'light' : 'vs-dark'}
            options={{
              minimap: { enabled: false },
            }}
            className="caret-transparent"
            onChange={handleEditorChange}
          />
        </Card>
        <div className="flex flex-col space-y-5">
          <div className="inline">
            <p className="inline font-bold">Description: </p>
            <Link
              href="https://api.otog.cf/problem/doc/944"
              target="_blank"
              className="inline"
            >
              [{problem.name}]
            </Link>
          </div>
          <Input
            id="sourcecode"
            type="file"
            onChange={handleFileUpload}
            className={fileInputColor}
          />
          <div className="flex flex-row space-x-4">
            <Select onValueChange={handleLanguage}>
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
              disabled={!(sourcecode && language)}
              className="w-1/2"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

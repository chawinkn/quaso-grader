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
import { useState } from 'react'

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
      ext: 'c',
    },
    {
      name: 'C++',
      ext: 'cpp',
    },
    {
      name: 'Python',
      ext: 'py',
    },
  ]

  const handleLanguage = (value: string) => {
    setLanguauge(value)
  }

  const handleSourceCode = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async () => {
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString();
  
    alert(`Submitted at ${formattedTime}`);
  };
  

  return (
    <div className='flex flex-col items-center justify-center py-10'>
      <p className="font-bold">{problem.name}</p>
      <p className="text-sm">Time Limit: 1 ms</p>
      <p className="text-sm">Memory: 64 megabytes</p>
      <div className="flex flex-col sm:flex-row h-3/4 mt-5 space-y-4 sm:space-x-4">
        <div className="w-[350px] lg:w-[500px] xl:w-[700px] h-[400px] border">
          <Editor
            language={language}
            value={sourcecode}
            theme={theme === 'light' ? 'light' : 'vs-dark'}
            options={{
              minimap: { enabled: false },
              padding: { top: 10, bottom: 10 },
              roundedSelection: true,
            }}
            className="caret-transparent"
          />
        </div>
        <div className="flex flex-col space-y-4">
          <Input
            id="sourcecode"
            type="file"
            onChange={handleSourceCode}
            className={fileInputColor}
          />
          <Select onValueChange={handleLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languageList.map((lang) => (
                <SelectItem key={lang.name} value={lang.ext}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="mt-5" onClick={handleSubmit}>Submit</Button>
          <Button className="mt-5">Submission</Button>
        </div>
      </div>
    </div>
  )
}

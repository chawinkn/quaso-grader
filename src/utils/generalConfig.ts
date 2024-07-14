export function getConfig() {
  const availableLanguages = process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGE?.split(
    ','
  ) ?? ['c', 'cpp', 'python']

  const languages = [
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

  return {
    languages: languages.map((language) => ({
      ...language,
      available: availableLanguages.includes(language.language),
    })),
    auto_approve: process.env.NEXT_PUBLIC_AUTO_APPROVE === 'true',
    result_interval: Number(process.env.NEXT_PUBLIC_RESULT_INTERVAL) || 5,
  }
}

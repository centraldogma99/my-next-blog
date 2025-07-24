'use client'

import { useTheme } from '@/contexts/ThemeContext'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const handleToggle = () => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark')
    }
  }

  const handleSystemMode = () => {
    setTheme('system')
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        className="p-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800"
        title={`현재: ${resolvedTheme === 'dark' ? '다크' : '라이트'} 모드`}
      >
        {resolvedTheme === 'dark' ? '🌙' : '☀️'}
      </button>
      
      <button
        onClick={handleSystemMode}
        className={`p-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 ${
          theme === 'system' ? 'bg-blue-100 dark:bg-blue-900' : ''
        }`}
        title="시스템 설정 따르기"
      >
        🖥️
      </button>
      
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {theme === 'system' ? '시스템' : theme === 'dark' ? '다크' : '라이트'}
      </span>
    </div>
  )
}
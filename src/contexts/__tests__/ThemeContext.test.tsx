import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../ThemeContext'

const TestComponent = () => {
  const { theme, setTheme } = useTheme()
  
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={() => setTheme('light')}>라이트 모드</button>
      <button onClick={() => setTheme('dark')}>다크 모드</button>
    </div>
  )
}

const mockDocumentElement = {
  classList: {
    remove: vi.fn(),
    add: vi.fn(),
  },
}

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(document, 'documentElement', {
      value: mockDocumentElement,
      writable: true,
    })
  })

  it('기본값으로 다크 테마를 설정한다', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
  })

  it('테마 변경 시 상태가 업데이트된다', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    fireEvent.click(screen.getByText('라이트 모드'))
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
  })

  it('테마 변경 시 document 클래스가 업데이트된다', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    fireEvent.click(screen.getByText('라이트 모드'))
    
    expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('light', 'dark')
    expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('light')
  })

  it('다크 모드로 변경할 때 올바른 클래스를 적용한다', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    fireEvent.click(screen.getByText('라이트 모드'))
    fireEvent.click(screen.getByText('다크 모드'))
    
    expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('light', 'dark')
    expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark')
  })

  it('ThemeProvider 없이 useTheme 사용 시 에러를 던진다', () => {
    const ErrorComponent = () => {
      useTheme()
      return <div>Test</div>
    }

    expect(() => render(<ErrorComponent />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    )
  })
})
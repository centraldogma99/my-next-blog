import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TabFilter from '../TabFilter'

const mockProps = {
  tagAndCounts: {
    javascript: 5,
    react: 3,
    typescript: 2,
    nodejs: 1,
  },
  selectedTag: null,
  onTagSelect: vi.fn(),
  totalPosts: 11,
}

describe('TabFilter', () => {
  it('모든 포스트 버튼을 렌더링한다', () => {
    render(<TabFilter {...mockProps} />)
    
    expect(screen.getByText('모든 포스트')).toBeInTheDocument()
    expect(screen.getByText('11')).toBeInTheDocument()
  })

  it('태그 목록을 카운트 순으로 정렬하여 표시한다', () => {
    render(<TabFilter {...mockProps} />)
    
    const tagButtons = screen.getAllByRole('button').slice(1)
    const tagNames = tagButtons.map(button => 
      button.querySelector('span:nth-child(2)')?.textContent
    )
    
    expect(tagNames).toEqual(['javascript', 'react', 'typescript', 'nodejs'])
  })

  it('각 태그의 포스트 개수를 표시한다', () => {
    render(<TabFilter {...mockProps} />)
    
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('모든 포스트 버튼 클릭 시 onTagSelect를 null로 호출한다', () => {
    const onTagSelect = vi.fn()
    render(<TabFilter {...mockProps} onTagSelect={onTagSelect} />)
    
    fireEvent.click(screen.getByText('모든 포스트'))
    
    expect(onTagSelect).toHaveBeenCalledWith(null)
  })

  it('특정 태그 버튼 클릭 시 해당 태그로 onTagSelect가 호출된다', () => {
    const onTagSelect = vi.fn()
    render(<TabFilter {...mockProps} onTagSelect={onTagSelect} />)
    
    fireEvent.click(screen.getByText('javascript'))
    
    expect(onTagSelect).toHaveBeenCalledWith('javascript')
  })

  it('선택된 태그가 있을 때 올바른 스타일을 적용한다', () => {
    render(<TabFilter {...mockProps} selectedTag="javascript" />)
    
    const selectedButton = screen.getByText('javascript').closest('button')
    const allPostsButton = screen.getByText('모든 포스트').closest('button')
    
    expect(selectedButton).toHaveClass('bg-[var(--color-primary)]', 'text-white')
    expect(allPostsButton).not.toHaveClass('bg-[var(--color-primary)]', 'text-white')
  })

  it('총 태그 개수를 표시한다', () => {
    render(<TabFilter {...mockProps} />)
    
    expect(screen.getByText('총 4개의 태그')).toBeInTheDocument()
  })

  it('태그가 없을 때도 올바르게 렌더링된다', () => {
    const emptyProps = {
      ...mockProps,
      tagAndCounts: {},
      totalPosts: 0,
    }
    
    render(<TabFilter {...emptyProps} />)
    
    expect(screen.getByText('모든 포스트')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('총 0개의 태그')).toBeInTheDocument()
  })
})
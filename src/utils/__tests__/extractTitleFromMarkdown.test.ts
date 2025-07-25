import { describe, it, expect } from 'vitest'
import { extractTitleFromMarkdown } from '../extractTitleFromMarkdown'

describe('extractTitleFromMarkdown', () => {
  it('frontmatter에서 제목을 추출한다', () => {
    const markdown = `---
title: "테스트 제목"
date: "2023-01-01"
---

# 본문 제목

내용`

    expect(extractTitleFromMarkdown(markdown)).toBe('테스트 제목')
  })

  it('따옴표 없는 제목을 추출한다', () => {
    const markdown = `---
title: 따옴표 없는 제목
date: "2023-01-01"
---

내용`

    expect(extractTitleFromMarkdown(markdown)).toBe('따옴표 없는 제목')
  })

  it('단일 따옴표로 감싸인 제목을 추출한다', () => {
    const markdown = `---
title: '단일 따옴표 제목'
date: "2023-01-01"
---

내용`

    expect(extractTitleFromMarkdown(markdown)).toBe('단일 따옴표 제목')
  })

  it('frontmatter가 없으면 빈 문자열을 반환한다', () => {
    const markdown = `# 제목

내용`

    expect(extractTitleFromMarkdown(markdown)).toBe('')
  })

  it('title 필드가 없으면 빈 문자열을 반환한다', () => {
    const markdown = `---
author: "작성자"
date: "2023-01-01"
---

내용`

    expect(extractTitleFromMarkdown(markdown)).toBe('')
  })

  it('여러 줄 frontmatter에서 제목을 추출한다', () => {
    const markdown = `---
author: "작성자"
title: "여러 줄 중간의 제목"
date: "2023-01-01"
tags: 
  - javascript
  - react
---

내용`

    expect(extractTitleFromMarkdown(markdown)).toBe('여러 줄 중간의 제목')
  })
})
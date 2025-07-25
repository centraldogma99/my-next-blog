import { describe, it, expect } from 'vitest'
import { parseFrontmatter, isValidFrontmatter } from '../parseFrontmatter'

describe('parseFrontmatter', () => {
  it('유효한 frontmatter를 파싱한다', () => {
    const markdown = `---
title: "테스트 포스트"
date: "2023-01-01"
draft: false
tag:
- javascript
- react
---

# 테스트 내용

이것은 테스트 내용입니다.`

    const result = parseFrontmatter(markdown)

    expect(result.frontmatter).toEqual({
      title: '테스트 포스트',
      date: '2023-01-01',
      draft: false,
      tag: ['javascript', 'react']
    })
    expect(result.content).toBe('# 테스트 내용\n\n이것은 테스트 내용입니다.')
  })

  it('subtitle이 있는 frontmatter를 파싱한다', () => {
    const markdown = `---
title: "메인 제목"
subtitle: "부제목"
date: "2023-01-01"
draft: false
tag:
- blog
---

내용`

    const result = parseFrontmatter(markdown)

    expect(result.frontmatter.subtitle).toBe('부제목')
  })

  it('boolean 값을 올바르게 파싱한다', () => {
    const markdown = `---
title: "테스트"
date: "2023-01-01"
draft: true
tag:
- test
---

내용`

    const result = parseFrontmatter(markdown)

    expect(result.frontmatter.draft).toBe(true)
  })

  it('frontmatter가 없으면 에러를 던진다', () => {
    const markdown = '# 제목\n\n내용'

    expect(() => parseFrontmatter(markdown)).toThrow('Invalid frontmatter')
  })

  it('필수 필드가 없으면 에러를 던진다', () => {
    const markdown = `---
title: "테스트"
---

내용`

    expect(() => parseFrontmatter(markdown)).toThrow('Invalid frontmatter')
  })
})

describe('isValidFrontmatter', () => {
  it('유효한 frontmatter를 검증한다', () => {
    const validFrontmatter = {
      title: '제목',
      date: '2023-01-01',
      draft: false,
      tag: ['javascript']
    }

    expect(isValidFrontmatter(validFrontmatter)).toBe(true)
  })

  it('필수 필드가 없으면 false를 반환한다', () => {
    const invalidFrontmatter = {
      title: '제목',
      date: '2023-01-01'
    }

    expect(isValidFrontmatter(invalidFrontmatter)).toBe(false)
  })

  it('잘못된 타입이면 false를 반환한다', () => {
    const invalidFrontmatter = {
      title: 123,
      date: '2023-01-01',
      draft: false,
      tag: ['javascript']
    }

    expect(isValidFrontmatter(invalidFrontmatter)).toBe(false)
  })
})
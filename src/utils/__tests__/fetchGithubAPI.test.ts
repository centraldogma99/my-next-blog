import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchBlogPostsGithubAPI } from '../fetchGithubAPI'

global.fetch = vi.fn()

describe('fetchBlogPostsGithubAPI', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('GitHub API를 올바른 URL과 헤더로 호출한다', async () => {
    const mockResponse = { name: 'test-repo' }
    const mockFetch = vi.mocked(fetch).mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    } as Response)

    process.env.GITHUB_API_KEY = 'test-token'

    await fetchBlogPostsGithubAPI('/contents')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/centraldogma99/dogma-blog-posts/contents',
      {
        headers: {
          Authorization: 'Bearer test-token',
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )
  })

  it('API 응답을 올바르게 반환한다', async () => {
    const mockResponse = { name: 'test-repo', stars: 100 }
    vi.mocked(fetch).mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    } as Response)

    const result = await fetchBlogPostsGithubAPI('/contents')

    expect(result).toEqual(mockResponse)
  })

  it('타입이 지정된 응답을 반환한다', async () => {
    interface TestResponse {
      id: number
      name: string
    }

    const mockResponse: TestResponse = { id: 1, name: 'test' }
    vi.mocked(fetch).mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    } as Response)

    const result = await fetchBlogPostsGithubAPI<TestResponse>('/contents')

    expect(result.id).toBe(1)
    expect(result.name).toBe('test')
  })

  it('다양한 경로에 대해 올바른 URL을 생성한다', async () => {
    const mockResponse = {}
    const mockFetch = vi.mocked(fetch).mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    } as Response)

    await fetchBlogPostsGithubAPI('/contents/posts/test.md')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/centraldogma99/dogma-blog-posts/contents/posts/test.md',
      expect.any(Object)
    )
  })
})
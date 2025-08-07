# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 일반적으로 사용되는 명령어

### 개발 및 테스트
- `pnpm dev`: 개발 서버 실행 (Turbopack 사용)
- `pnpm build`: 프로덕션 빌드 생성
- `pnpm start`: 프로덕션 서버 실행
- `pnpm lint`: ESLint 실행
- `pnpm test`: 감시 모드로 테스트 실행 (Vitest)
- `pnpm test:run`: 모든 테스트 단일 실행
- `pnpm test:ui`: UI 모드로 테스트 실행
- `pnpm test:coverage`: 커버리지 리포트와 함께 테스트 실행

### 패키지 관리
- `pnpm install`: 의존성 설치 (frozen-lockfile 사용 권장)
- `pnpm add <package>`: 새 패키지 추가

### 특정 테스트 실행
- `pnpm test [파일경로]`: 특정 테스트 파일 실행 (예: `pnpm test src/utils/__tests__/fetchGithubAPI.test.ts`)
- `pnpm test -t "테스트명"`: 특정 테스트 케이스 실행

## 높은 수준의 아키텍처

이 프로젝트는 GitHub API를 활용하여 외부 리포지토리(`centraldogma99/dogma-blog-posts`)에서 마크다운 블로그 포스트를 가져와 렌더링하는 Next.js 15 기반 블로그입니다.

### 핵심 데이터 플로우

1. **포스트 가져오기**: `fetchBlogPostsGithubAPI` 함수가 GitHub API를 통해 마크다운 파일 목록 및 내용을 가져옴
   - GitHub API 엔드포인트: `https://api.github.com/repos/centraldogma99/dogma-blog-posts/contents`
   - 인증: `GITHUB_API_KEY` 환경 변수 사용
   - 에러 처리: 404 시 `notFound()`, 기타 에러 시 예외 발생

2. **콘텐츠 처리**: 
   - Base64로 인코딩된 GitHub 응답을 `decodeBase64Content`로 디코딩
   - `parseContent`로 frontmatter와 본문 분리
   - Frontmatter 필드: `title`, `date`, `tag[]`, `description` (선택)

3. **렌더링 파이프라인**: 
   - 홈페이지(`page.tsx`): 포스트 목록 표시, 날짜 역순 정렬
   - 개별 포스트(`posts/[slug]/page.tsx`): Markdown 렌더링
   - 코드 블록: Shiki를 사용한 구문 강조 (서버 컴포넌트)

### 컴포넌트 아키텍처

#### 서버/클라이언트 컴포넌트 분리
- **서버 컴포넌트**: 
  - `app/page.tsx`: 데이터 페칭 및 초기 렌더링
  - `CodeBlock`: Shiki 구문 강조 처리 (무거운 라이브러리)
  - `posts/[slug]/page.tsx`: 마크다운 파싱 및 메타데이터 생성
  
- **클라이언트 컴포넌트** (`"use client"`):
  - `PostsList`: 태그 필터링 상태 관리
  - `TabFilter`: 태그 선택 인터랙션
  - `ThemeContext/ThemeToggle`: 테마 전환 상태
  - `HashScrollHandler`: 해시 기반 스크롤 동작
  - `TableOfContents`: 목차 내비게이션

#### 상태 관리
- **ThemeContext**: 전역 다크/라이트 테마 상태 (Context API)
- **태그 필터링**: PostsList 컴포넌트 로컬 상태
- **스크롤 위치**: HashScrollHandler의 useEffect 기반 처리

### 타입 시스템

- GitHub API 응답: `src/types/githubAPI/`
  - `GetContentsResponse`: 파일 목록 응답
  - `GetContentsDetailData`: 개별 파일 내용 응답
- 도메인 타입:
  - `Post`: 파일명과 frontmatter 포함
  - `Frontmatter`: 포스트 메타데이터
  - `Theme`: "light" | "dark"

## 환경 설정

### 필수 환경 변수
- `GITHUB_API_KEY`: GitHub Personal Access Token (GitHub API 인증에 필수)

### 테스트 환경
- **프레임워크**: Vitest + React Testing Library
- **환경**: jsdom
- **커버리지 임계값**: 80% (lines, functions, branches, statements)
- **제외 대상**: 페이지 컴포넌트, 설정 파일
- **병렬 실행**: threads 풀 사용
- **리포터**: verbose, json, html

### 테스트 패턴
- 컴포넌트 테스트: `render()`, `screen`, `fireEvent` 사용
- 유틸리티 테스트: 순수 함수 단위 테스트
- 테마 통합 테스트: ThemeProvider 래핑 필요
- Mock 사용: `vi.mock()`, `vi.fn()`

## CI/CD

GitHub Actions를 통한 자동화:
- `ci.yml`: 모든 브랜치에서 린트 및 테스트 실행
- `claude.yml`, `claude-code-review.yml`: Claude AI 통합 워크플로우

## 기술 스택
- **프레임워크**: Next.js 15.4.1 (App Router)
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS 4
- **마크다운**: react-markdown + Shiki (구문 강조)
- **패키지 관리자**: pnpm 10.12.3
- **테스트**: Vitest + React Testing Library
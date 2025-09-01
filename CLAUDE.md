# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**My Next Blog**는 GitHub 리포지토리(`centraldogma99/dogma-blog-posts`)에서 마크다운 파일을 가져와 블로그 포스트로 렌더링하는 Next.js 15 기반 블로그 애플리케이션입니다.

### 핵심 특징
- GitHub API를 통한 외부 콘텐츠 관리
- SHA 해시 기반 안전한 파일 업데이트
- 다크/라이트 테마 지원
- 태그 기반 포스트 필터링
- Draft/공개 포스트 분리 관리
- 서버 사이드 렌더링 (SSR) 최적화
- 반응형 디자인
- MDEditor를 활용한 관리자 포스트 편집 기능
- NextAuth를 통한 인증 시스템

## 일반적으로 사용되는 명령어

### 개발 및 테스트
- `pnpm dev`: 개발 서버 실행 (Turbopack 사용, 포트 3000)
- `pnpm build`: 프로덕션 빌드 생성
- `pnpm start`: 프로덕션 서버 실행
- `pnpm lint`: ESLint 실행 (코드 품질 검사)
- `pnpm test`: 감시 모드로 테스트 실행 (Vitest)
- `pnpm test:run`: 모든 테스트 단일 실행
- `pnpm test:ui`: UI 모드로 테스트 실행
- `pnpm test:coverage`: 커버리지 리포트와 함께 테스트 실행

### 패키지 관리
- `pnpm install`: 의존성 설치 (frozen-lockfile 사용 권장)
- `pnpm add <package>`: 새 패키지 추가
- `pnpm remove <package>`: 패키지 제거

### 특정 테스트 실행
- `pnpm test [파일경로]`: 특정 테스트 파일 실행 (예: `pnpm test src/utils/__tests__/fetchGithubAPI.test.ts`)
- `pnpm test -t "테스트명"`: 특정 테스트 케이스 실행

## 디렉토리 구조

```
my-next-blog/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx              # 홈페이지 (포스트 목록)
│   │   ├── layout.tsx            # 루트 레이아웃 (폰트, 테마, 메타데이터)
│   │   ├── globals.css           # Tailwind CSS 전역 스타일
│   │   ├── PostsList.tsx         # 포스트 목록 클라이언트 컴포넌트
│   │   ├── PostsContainer.tsx    # 포스트 컨테이너
│   │   ├── TabFilter.tsx         # 태그 필터 UI
│   │   ├── DraftToggle.tsx       # Draft 포스트 토글
│   │   ├── loading.tsx           # 로딩 상태 UI
│   │   ├── not-found.tsx         # 404 페이지
│   │   ├── sitemap.ts            # 동적 사이트맵 생성
│   │   ├── robots.ts             # robots.txt 생성
│   │   ├── opengraph-image.tsx  # OG 이미지 생성
│   │   ├── posts/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # 개별 포스트 페이지
│   │   ├── admin/                # 관리자 영역
│   │   │   ├── posts/
│   │   │   │   ├── new/          # 새 포스트 작성
│   │   │   │   └── [slug]/edit/  # 포스트 편집
│   │   │   └── drafts/
│   │   │       └── [slug]/       # Draft 포스트 상세 페이지
│   │   ├── auth/                 # 인증 관련 페이지
│   │   ├── api/                  # API 라우트
│   │   │   └── auth/             # NextAuth 핸들러
│   │   └── __tests__/            # 앱 레벨 테스트
│   ├── components/               # 재사용 가능한 컴포넌트
│   │   ├── ThemeToggle.tsx       # 테마 전환 버튼
│   │   ├── AuthButton.tsx        # 로그인/로그아웃 버튼
│   │   ├── AuthProvider.tsx      # NextAuth 세션 프로바이더
│   │   ├── AdminButtons.tsx      # 관리자 액션 버튼 (SHA 기반 업데이트)
│   │   └── NewPostButton.tsx     # 새 포스트 작성 버튼
│   ├── contexts/                 # React Context
│   │   └── ThemeContext.tsx      # 테마 상태 관리
│   ├── utils/                    # 유틸리티 함수
│   │   ├── api/
│   │   │   └── github.ts         # GitHub API 통합 함수 (SHA 포함)
│   │   ├── fetchGithubAPI.ts     # GitHub API 통신
│   │   ├── githubBlogPost.ts     # 블로그 포스트 fetching
│   │   ├── parseFrontmatter.ts   # Frontmatter 파싱
│   │   ├── decodeBase64Content.ts # Base64 디코딩
│   │   ├── extractHeadingsWithIds.ts # 헤딩 추출
│   │   ├── generateSlug.ts       # URL slug 생성
│   │   ├── scrollToElement.ts    # 스크롤 유틸리티
│   │   ├── frontmatter.ts        # Frontmatter 관련 유틸리티
│   │   └── __tests__/            # 유틸리티 테스트
│   ├── types/                    # TypeScript 타입 정의
│   │   └── githubAPI/            # GitHub API 타입
│   ├── constants/                # 상수 정의
│   ├── fonts/                    # 폰트 파일
│   └── test/                     # 테스트 설정
│       └── setup.ts              # Vitest 설정
├── public/                       # 정적 파일
├── scripts/                      # 빌드/배포 스크립트
├── .github/                      # GitHub Actions 워크플로우
└── 설정 파일들                    # (package.json, tsconfig.json 등)
```

## 높은 수준의 아키텍처

### API 엔드포인트

#### 포스트 관련 API
- `GET /api/posts/[slug]`: 개별 포스트 정보 조회
- `PUT /api/posts/[slug]`: 포스트 업데이트 (SHA 필수)
- `DELETE /api/posts/[slug]`: 포스트 삭제 (SHA 필수)
- `POST /api/posts/[slug]/toggle-draft`: Draft 상태 토글 (SHA 필수)
- `POST /api/posts`: 새 포스트 생성

### 핵심 데이터 플로우

1. **포스트 가져오기**: 
   - `fetchBlogPosts`, `fetchSingleBlogPost` 함수가 GitHub API를 통해 마크다운 파일 목록 및 내용을 가져옴
   - GitHub API 엔드포인트: `https://api.github.com/repos/centraldogma99/dogma-blog-posts/contents`
   - 인증: `GITHUB_API_KEY` 환경 변수 사용
   - 에러 처리: 404 시 `notFound()`, 기타 에러 시 예외 발생
   - 캐싱: Next.js의 `revalidate` 옵션으로 ISR(Incremental Static Regeneration) 구현
   - **SHA 값 활용**: GitHub 파일의 SHA 해시값을 포함하여 업데이트 시 사용

2. **콘텐츠 처리**: 
   - Base64로 인코딩된 GitHub 응답을 `decodeBase64Content`로 디코딩
   - `parseContent`로 frontmatter와 본문 분리
   - Frontmatter 필드: 
     - `title`: 포스트 제목 (필수)
     - `date`: 작성일 (필수, YYYY-MM-DD 형식)
     - `tag[]`: 태그 배열 (필수)
     - `description`: 포스트 설명 (선택)
     - `draft`: 초안 여부 (선택, boolean)

3. **렌더링 파이프라인**: 
   - 홈페이지(`page.tsx`): 포스트 목록 표시, 날짜 역순 정렬
   - 개별 포스트(`posts/[slug]/page.tsx`): 
     - react-markdown으로 Markdown 파싱
     - Shiki를 사용한 코드 구문 강조
     - 목차(TOC) 자동 생성
     - 해시 기반 스크롤 내비게이션
   - Draft 포스트 페이지(`admin/drafts/[slug]/page.tsx`):
     - 인증된 사용자만 접근 가능
     - Draft 상태 포스트 미리보기

### 컴포넌트 아키텍처

#### 서버/클라이언트 컴포넌트 분리

**서버 컴포넌트** (기본값, 데이터 페칭 및 정적 렌더링):
- `app/page.tsx`: 포스트 목록 데이터 페칭
- `posts/[slug]/page.tsx`: 개별 포스트 데이터 페칭 및 메타데이터 생성
- `admin/drafts/[slug]/page.tsx`: Draft 포스트 데이터 페칭
- `CodeBlock`: Shiki 구문 강조 처리 (무거운 라이브러리)
- SEO 관련 컴포넌트들 (sitemap, robots, opengraph)

**클라이언트 컴포넌트** (`"use client"` 지시문 사용):
- `PostsList`: 태그 필터링 상태 관리, Draft 포스트는 `/admin/drafts/[slug]`로 라우팅
- `TabFilter`: 태그 선택 인터랙션
- `DraftToggle`: Draft 포스트 표시 토글
- `ThemeContext/ThemeToggle`: 테마 전환 상태
- `HashScrollHandler`: 해시 기반 스크롤 동작
- `TableOfContents`: 목차 내비게이션
- `MDEditor` 기반 컴포넌트들 (관리자 영역)
- `AuthButton`, `AuthProvider`: 인증 관련 컴포넌트
- `AdminButtons`: SHA 값을 활용한 Draft 토글 및 포스트 편집

#### 상태 관리
- **ThemeContext**: 전역 다크/라이트 테마 상태 (Context API + localStorage)
- **NextAuth Session**: 인증 상태 관리
- **태그 필터링**: PostsList 컴포넌트 로컬 상태
- **Draft 토글**: DraftToggle 컴포넌트 로컬 상태
- **스크롤 위치**: HashScrollHandler의 useEffect 기반 처리

### 타입 시스템

#### GitHub API 타입 (`src/types/githubAPI/`)
- `GetContentsResponse`: 파일 목록 응답
- `GetContentsDetailData`: 개별 파일 내용 응답 (SHA 필드 포함)

#### 도메인 타입
- `BlogPost`: 파일명, frontmatter, content, SHA 포함
- `Frontmatter`: 포스트 메타데이터
- `Theme`: "light" | "dark"
- `FetchPostsOptions`: 포스트 fetching 옵션 (includeDrafts, includeContent, sortByDate)

## 주요 의존성

### 프로덕션 의존성
- `next`: 15.4.1 - React 프레임워크
- `react`, `react-dom`: 19.1.0 - UI 라이브러리
- `react-markdown`: 10.1.0 - 마크다운 렌더링
- `shiki`: 3.8.1 - 코드 구문 강조
- `@uiw/react-md-editor`: 4.0.8 - 마크다운 에디터
- `next-auth`: 4.24.11 - 인증 시스템
- `octokit`: 5.0.3 - GitHub API 클라이언트
- `lucide-react`: 0.525.0 - 아이콘 라이브러리
- `tailwind-merge`: 3.3.1 - Tailwind 클래스 병합 유틸리티
- `@vercel/analytics`, `@vercel/speed-insights`: 성능 모니터링

### 개발 의존성
- `typescript`: 5.x - 타입 시스템
- `@types/*`: TypeScript 타입 정의
- `vitest`: 1.6.1 - 테스트 프레임워크
- `@testing-library/*`: React 테스트 유틸리티
- `@vitest/coverage-v8`: 코드 커버리지
- `tailwindcss`: 4.x - CSS 프레임워크
- `eslint`, `prettier`: 코드 품질 도구

## 환경 설정

### 필수 환경 변수
```env
GITHUB_API_KEY=          # GitHub Personal Access Token (필수)
NEXTAUTH_URL=            # NextAuth URL (프로덕션에서 필수)
NEXTAUTH_SECRET=         # NextAuth 암호화 키 (필수)
```

### 개발 환경 설정
1. Node.js 20+ 및 pnpm 10.12.3+ 설치
2. `pnpm install` 실행
3. `.env.local` 파일 생성 및 환경 변수 설정
4. `pnpm dev` 실행

## 테스트

### 테스트 환경
- **프레임워크**: Vitest + React Testing Library
- **환경**: jsdom
- **커버리지 임계값**: 80% (lines, functions, branches, statements)
- **제외 대상**: 페이지 컴포넌트, 설정 파일
- **병렬 실행**: threads 풀 사용
- **리포터**: verbose, json, html

### 테스트 패턴
- **컴포넌트 테스트**: `render()`, `screen`, `fireEvent` 사용
- **유틸리티 테스트**: 순수 함수 단위 테스트
- **테마 통합 테스트**: ThemeProvider 래핑 필요
- **Mock 사용**: `vi.mock()`, `vi.fn()`

### 테스트 실행 예시
```bash
# 모든 테스트 실행
pnpm test:run

# 특정 파일 테스트
pnpm test src/utils/__tests__/fetchGithubAPI.test.ts

# 커버리지 확인
pnpm test:coverage

# UI 모드로 테스트
pnpm test:ui
```

## CI/CD

### GitHub Actions 워크플로우
- **ci.yml**: 
  - 모든 브랜치에서 자동 실행
  - 린트, 타입 체크, 테스트 실행
  - 테스트 커버리지 리포트 생성
  
- **claude.yml, claude-code-review.yml**: 
  - Claude AI 통합 코드 리뷰
  - PR 자동 분석 및 피드백

### 배포
- **플랫폼**: Vercel (권장) 또는 다른 Next.js 호스팅 서비스
- **빌드 명령어**: `pnpm build`
- **환경 변수**: 프로덕션 환경에서 설정 필요

## 성능 최적화

### 적용된 최적화
- **ISR (Incremental Static Regeneration)**: 포스트 데이터 캐싱
- **이미지 최적화**: Next.js Image 컴포넌트 사용
- **코드 스플리팅**: 자동 적용 (App Router)
- **폰트 최적화**: next/font 사용
- **Turbopack**: 개발 환경 빌드 속도 향상
- **Dynamic Import**: MDEditor 등 무거운 컴포넌트 동적 로딩

### 모니터링
- **Vercel Analytics**: 실시간 성능 모니터링
- **Vercel Speed Insights**: 사용자 경험 메트릭

## 개발 가이드라인

### 코드 스타일
- TypeScript strict 모드 사용
- ESLint + Prettier 규칙 준수
- 함수형 컴포넌트 우선
- Custom Hook 패턴 활용
- 서버 컴포넌트 우선, 필요시만 클라이언트 컴포넌트 사용

### 커밋 컨벤션
- feat: 새로운 기능
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅
- refactor: 코드 리팩토링
- test: 테스트 추가/수정
- chore: 빌드 프로세스 등 기타 변경

### 중요 참고사항
- 사용자가 지시한 작업을 완료한 후 개발 서버를 실행하지 않아야 함
- 작업 후 불필요한 추가 작업을 수행하지 않아야 함
- 코드 수정 시 기존 코드 스타일과 패턴을 따라야 함
- 보안 관련 정보(API 키, 시크릿 등)를 코드에 직접 포함하지 않아야 함
- 기존 테스트가 있는 경우 테스트도 함께 업데이트해야 함
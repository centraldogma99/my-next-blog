# 코드베이스 구조

## 디렉토리 구조
```
my-next-blog/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # 홈페이지 (포스트 목록)
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── globals.css         # 전역 스타일
│   │   ├── PostsList.tsx       # 포스트 목록 컴포넌트 (클라이언트)
│   │   ├── PostsContainer.tsx  # 포스트 컨테이너
│   │   ├── TabFilter.tsx       # 태그 필터 컴포넌트
│   │   ├── DraftToggle.tsx     # Draft 토글 버튼
│   │   ├── posts/
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # 개별 포스트 페이지
│   │   └── __tests__/          # 앱 레벨 테스트
│   ├── components/             # 재사용 가능한 컴포넌트
│   │   └── ThemeToggle.tsx     # 테마 전환 버튼
│   ├── contexts/               # React Context
│   │   └── ThemeContext.tsx    # 테마 상태 관리
│   ├── utils/                  # 유틸리티 함수
│   │   ├── fetchGithubAPI.ts   # GitHub API 통신
│   │   ├── githubBlogPost.ts   # 블로그 포스트 fetching
│   │   ├── parseFrontmatter.ts # Frontmatter 파싱
│   │   ├── decodeBase64Content.ts
│   │   ├── extractHeadingsWithIds.ts
│   │   ├── generateSlug.ts
│   │   ├── scrollToElement.ts
│   │   └── __tests__/          # 유틸리티 테스트
│   ├── types/                  # TypeScript 타입 정의
│   │   └── githubAPI/          # GitHub API 타입
│   ├── constants/              # 상수 정의
│   ├── fonts/                  # 폰트 파일
│   └── test/                   # 테스트 설정
│       └── setup.ts            # Vitest 설정
├── public/                     # 정적 파일
├── html/                       # 빌드 아티팩트
├── package.json               # 의존성 및 스크립트
├── tsconfig.json              # TypeScript 설정
├── vitest.config.ts           # Vitest 설정
├── eslint.config.mjs          # ESLint 설정
├── tailwind.config.ts         # Tailwind CSS 설정
├── next.config.ts             # Next.js 설정
└── CLAUDE.md                  # Claude AI 가이드라인
```

## 핵심 데이터 플로우
1. GitHub API에서 마크다운 포스트 가져오기 (`fetchGithubAPI`)
2. Base64 디코딩 및 Frontmatter 파싱
3. 서버 컴포넌트에서 데이터 처리
4. 클라이언트 컴포넌트에서 인터랙션 처리

## 주요 경계
- **서버/클라이언트**: App Router의 서버 컴포넌트 우선
- **데이터 소스**: GitHub 리포지토리 (외부)
- **상태 관리**: Context API (테마), 로컬 상태 (필터링)
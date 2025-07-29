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

## 높은 수준의 아키텍처

이 프로젝트는 GitHub API를 활용하여 외부 리포지토리(`centraldogma99/dogma-blog-posts`)에서 마크다운 블로그 포스트를 가져와 렌더링하는 Next.js 15 기반 블로그입니다.

### 핵심 데이터 플로우
1. **포스트 가져오기**: `fetchGithubAPI.ts`가 GitHub API를 통해 마크다운 파일 목록 및 내용을 가져옴
2. **콘텐츠 처리**: Base64로 인코딩된 GitHub 응답을 디코딩하고 frontmatter를 파싱
3. **렌더링 파이프라인**: 
   - 홈페이지에서 포스트 목록을 태그 필터링과 함께 표시
   - 개별 포스트 페이지에서 마크다운을 파싱하고 Shiki를 사용한 구문 강조 적용

### 주요 컴포넌트 상호작용
- **PostsList**: 클라이언트 컴포넌트로 태그 필터링 상태 관리
- **CodeBlock**: 서버 컴포넌트로 Shiki를 사용한 구문 강조 처리
- **ThemeContext**: 전역 다크/라이트 테마 상태 관리 (클라이언트 전용)

### 타입 안전성
모든 GitHub API 응답은 `src/types/githubAPI/` 디렉토리에 정의된 타입으로 엄격하게 관리됩니다.

## 환경 설정

### 필수 환경 변수
- `GITHUB_API_KEY`: GitHub Personal Access Token (GitHub API 인증에 필수)

### 테스트 환경
- Vitest + React Testing Library 사용
- 테스트 커버리지 임계값: 80% (lines, functions, branches, statements)
- `src/test/setup.ts`에서 전역 테스트 환경 설정

## CI/CD

GitHub Actions를 통한 자동화:
- `ci.yml`: 모든 브랜치에서 린트 및 테스트 실행
- `claude.yml`, `claude-code-review.yml`: Claude AI 통합 워크플로우
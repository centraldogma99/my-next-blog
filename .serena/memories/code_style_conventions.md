# 코드 스타일 및 컨벤션

## TypeScript 설정
- **Strict Mode**: 활성화 (strict: true)
- **Target**: ES2017
- **Module**: ESNext with bundler resolution
- **Path Alias**: `@/*` → `./src/*`
- **JSX**: preserve (Next.js가 처리)

## 코드 스타일
- **들여쓰기**: 2 스페이스 (Prettier 기본값)
- **세미콜론**: 필수 (Prettier 기본값)
- **따옴표**: 더블 쿼트 선호 (Prettier 기본값)
- **후행 쉼표**: ES5 스타일 (Prettier 기본값)

## 네이밍 컨벤션
- **컴포넌트**: PascalCase (예: `PostsList`, `ThemeToggle`)
- **유틸리티 함수**: camelCase (예: `fetchGithubAPI`, `parseFrontmatter`)
- **파일명**:
  - React 컴포넌트: PascalCase.tsx
  - 유틸리티: camelCase.ts
  - 테스트: `*.test.ts` 또는 `*.test.tsx`

## React/Next.js 패턴
- **서버 컴포넌트**: 기본값 (async 함수 사용 가능)
- **클라이언트 컴포넌트**: `"use client"` 디렉티브 필요
- **App Router**: src/app 디렉토리 구조
- **동적 라우트**: `[slug]` 폴더 패턴

## Import 순서
1. React/Next.js imports
2. 외부 라이브러리
3. 내부 모듈 (`@/` 별칭 사용)
4. 타입 imports

## 주석
- 한국어 주석 사용 가능
- 복잡한 로직에 대한 설명 제공
- TODO 주석은 명확한 액션 아이템 포함
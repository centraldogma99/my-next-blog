# 프로젝트 개요

## 프로젝트 목적
My Next Blog는 GitHub 리포지토리(centraldogma99/dogma-blog-posts)에서 마크다운 파일을 가져와서 블로그 포스트로 표시하는 Next.js 기반 블로그 프로젝트입니다.

## 주요 기능
- GitHub API를 통한 마크다운 포스트 가져오기
- 다크/라이트 테마 지원
- 태그 기반 포스트 필터링
- 반응형 디자인
- TypeScript 완전 지원
- 포괄적인 테스트 커버리지

## 기술 스택
- **프레임워크**: Next.js 15.4.1 (App Router, Turbopack)
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS 4
- **마크다운 렌더링**: react-markdown + Shiki (구문 강조)
- **패키지 관리자**: pnpm 10.12.3
- **테스트**: Vitest + React Testing Library
- **린팅**: ESLint (Next.js 설정)
- **포매팅**: Prettier (기본 설정)

## 외부 의존성
- GitHub API (포스트 데이터 소스)
- 환경 변수: GITHUB_API_KEY (필수)
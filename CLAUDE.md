# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 일반적으로 사용되는 명령어

### 개발 및 빌드
- `pnpm dev`: 개발 서버 실행 (Turbopack 사용)
- `pnpm build`: 프로덕션 빌드 생성
- `pnpm start`: 프로덕션 서버 실행
- `pnpm lint`: ESLint 실행

### 패키지 관리
- `pnpm install`: 의존성 설치
- `pnpm add <package>`: 새 패키지 추가

**참고**: 이 프로젝트는 pnpm을 사용하며, 테스트 스크립트는 현재 설정되어 있지 않습니다.

## 코드 구조

GitHub 리포지토리에서 마크다운 파일을 가져와서 블로그 포스트로 표시하는 간단한 Next.js 블로그입니다.

- `src/app/page.tsx`: 홈페이지 (블로그 포스트 목록)
- `src/app/posts/[slug]/page.tsx`: 개별 포스트 페이지
- `src/utils/fetchBlogPostsGithubAPI.js`: GitHub API에서 마크다운 파일 가져오기
- `src/types/githubAPI/`: GitHub API 응답 타입 정의

## 환경 설정 및 의존성

### 환경 변수
- `GITHUB_API_KEY`: GitHub API 인증을 위한 Personal Access Token이 필요함

### 스타일링
- **Tailwind CSS 4**: 주요 스타일링 프레임워크
- **98.css & xp.css**: 레트로 Windows UI 스타일 (Windows 98/XP 테마)
- **Pretendard 폰트**: 한국어 최적화 웹폰트

### 특별한 패키지
- `react-markdown@10.1.0`: 마크다운 렌더링
- Next.js 15.4.1 & React 19.1.0: 최신 버전 사용

## 개발 시 주의사항

### GitHub API 제한
- GitHub API rate limiting을 고려하여 개발할 것
- 인증된 요청은 시간당 5,000회 제한

### 콘텐츠 구조
- 블로그 포스트는 마크다운 파일로 GitHub 리포지토리에 저장됨
- Frontmatter에 `title` 필드가 필수적으로 포함되어야 함
- 파일명이 URL slug로 사용됨

### 레트로 UI 컴포넌트
- Windows 98/XP 스타일의 창 컨트롤 버튼과 UI 요소들이 포함되어 있음
- 98.css와 xp.css 라이브러리의 클래스명을 활용할 것
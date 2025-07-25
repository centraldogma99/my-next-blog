# My Next Blog

[![CI](https://github.com/centraldogma99/my-next-blog/actions/workflows/ci.yml/badge.svg)](https://github.com/centraldogma99/my-next-blog/actions/workflows/ci.yml)

GitHub 리포지토리에서 마크다운 파일을 가져와서 블로그 포스트로 표시하는 Next.js 블로그 프로젝트입니다.

## 기능

- 📝 GitHub API를 통한 마크다운 포스트 가져오기
- 🎨 다크/라이트 테마 지원
- 🏷️ 태그 기반 포스트 필터링
- 📱 반응형 디자인
- 🎯 TypeScript 완전 지원
- ✅ 포괄적인 테스트 커버리지

## 개발 환경 설정

### 의존성 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## 테스트

### 테스트 실행

```bash
# 모든 테스트 실행
pnpm test:run

# 감시 모드로 테스트 실행
pnpm test

# UI 모드로 테스트 실행
pnpm test:ui

# 커버리지와 함께 테스트 실행
pnpm test:coverage
```

### 테스트 구조

- `src/utils/__tests__/`: 유틸리티 함수 테스트
- `src/components/__tests__/`: React 컴포넌트 테스트
- `src/contexts/__tests__/`: Context API 테스트
- `src/app/__tests__/`: 앱 레벨 컴포넌트 테스트

## 빌드 및 배포

```bash
# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 린터 실행
pnpm lint
```

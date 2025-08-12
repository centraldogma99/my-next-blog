# 자주 사용되는 개발 명령어

## 개발 서버
```bash
pnpm dev  # Turbopack을 사용한 개발 서버 실행 (localhost:3000)
```

## 빌드 및 프로덕션
```bash
pnpm build  # 프로덕션 빌드 생성
pnpm start  # 프로덕션 서버 실행
```

## 테스트
```bash
pnpm test        # 감시 모드로 테스트 실행 (개발 중 권장)
pnpm test:run    # 모든 테스트 단일 실행 (CI/CD용)
pnpm test:ui     # UI 모드로 테스트 실행 (시각적 디버깅)
pnpm test:coverage  # 커버리지 리포트와 함께 테스트 실행
```

### 특정 테스트 실행
```bash
pnpm test [파일경로]  # 특정 테스트 파일 실행
pnpm test -t "테스트명"  # 특정 테스트 케이스 실행
```

## 코드 품질
```bash
pnpm lint  # ESLint 실행 (Next.js 규칙 적용)
```

## 패키지 관리
```bash
pnpm install          # 의존성 설치 (frozen-lockfile 사용)
pnpm add <package>    # 새 패키지 추가
pnpm remove <package> # 패키지 제거
```

## 시스템 유틸리티 (macOS)
```bash
git  # 버전 관리
ls   # 파일 목록
cd   # 디렉토리 변경
grep # 텍스트 검색 (ripgrep/rg 권장)
find # 파일 검색
```
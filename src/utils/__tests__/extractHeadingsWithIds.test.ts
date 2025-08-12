import { describe, it, expect } from "vitest";
import { extractHeadingsWithIds } from "../extractHeadingsWithIds";

describe("extractHeadingsWithIds", () => {
  it("빈 콘텐츠에서 빈 배열을 반환해야 함", () => {
    const result = extractHeadingsWithIds("");
    expect(result).toEqual([]);
  });

  it("헤딩이 없는 콘텐츠에서 빈 배열을 반환해야 함", () => {
    const content = `
      일반 텍스트입니다.
      이것도 일반 텍스트입니다.
    `;
    const result = extractHeadingsWithIds(content);
    expect(result).toEqual([]);
  });

  it("단일 헤딩을 올바르게 추출해야 함", () => {
    const content = "# 제목입니다";
    const result = extractHeadingsWithIds(content);
    expect(result).toEqual([
      { id: "제목입니다", text: "제목입니다", level: 1 }
    ]);
  });

  it("여러 레벨의 헤딩을 올바르게 추출해야 함", () => {
    const content = `# 헤딩 1
## 헤딩 2
### 헤딩 3
#### 헤딩 4
##### 헤딩 5
###### 헤딩 6`;
    
    const result = extractHeadingsWithIds(content);
    expect(result).toEqual([
      { id: "헤딩-1", text: "헤딩 1", level: 1 },
      { id: "헤딩-2", text: "헤딩 2", level: 2 },
      { id: "헤딩-3", text: "헤딩 3", level: 3 },
      { id: "헤딩-4", text: "헤딩 4", level: 4 },
      { id: "헤딩-5", text: "헤딩 5", level: 5 },
      { id: "헤딩-6", text: "헤딩 6", level: 6 }
    ]);
  });

  it("중복된 헤딩 텍스트에 고유한 ID를 생성해야 함", () => {
    const content = `# 같은 제목
## 같은 제목
### 같은 제목
## 다른 제목
### 같은 제목`;
    
    const result = extractHeadingsWithIds(content);
    expect(result).toEqual([
      { id: "같은-제목", text: "같은 제목", level: 1 },
      { id: "같은-제목-1", text: "같은 제목", level: 2 },
      { id: "같은-제목-2", text: "같은 제목", level: 3 },
      { id: "다른-제목", text: "다른 제목", level: 2 },
      { id: "같은-제목-3", text: "같은 제목", level: 3 }
    ]);
  });

  it("특수문자가 포함된 헤딩을 올바르게 처리해야 함", () => {
    const content = `# Hello, World!
## TypeScript & JavaScript
### 100% 완료
#### Node.js v20.0.0`;
    
    const result = extractHeadingsWithIds(content);
    expect(result).toEqual([
      { id: "hello-world", text: "Hello, World!", level: 1 },
      { id: "typescript-javascript", text: "TypeScript & JavaScript", level: 2 },
      { id: "100-완료", text: "100% 완료", level: 3 },
      { id: "nodejs-v2000", text: "Node.js v20.0.0", level: 4 }
    ]);
  });

  it("헤딩과 일반 텍스트가 섞인 콘텐츠를 올바르게 처리해야 함", () => {
    const content = `# 첫 번째 헤딩
이것은 일반 텍스트입니다.

## 두 번째 헤딩
더 많은 텍스트입니다.

### 세 번째 헤딩`;
    
    const result = extractHeadingsWithIds(content);
    expect(result).toEqual([
      { id: "첫-번째-헤딩", text: "첫 번째 헤딩", level: 1 },
      { id: "두-번째-헤딩", text: "두 번째 헤딩", level: 2 },
      { id: "세-번째-헤딩", text: "세 번째 헤딩", level: 3 }
    ]);
  });

  it("한국어와 영어가 섞인 헤딩을 올바르게 처리해야 함", () => {
    const content = `# React Hook 사용법
## useState 기본
### useEffect 활용하기`;
    
    const result = extractHeadingsWithIds(content);
    expect(result).toEqual([
      { id: "react-hook-사용법", text: "React Hook 사용법", level: 1 },
      { id: "usestate-기본", text: "useState 기본", level: 2 },
      { id: "useeffect-활용하기", text: "useEffect 활용하기", level: 3 }
    ]);
  });

  it("이모지가 포함된 헤딩을 올바르게 처리해야 함", () => {
    const content = `# 🚀 시작하기
## ⚡ 빠른 설정
### ✅ 완료`;
    
    const result = extractHeadingsWithIds(content);
    expect(result).toEqual([
      { id: "시작하기", text: "🚀 시작하기", level: 1 },
      { id: "빠른-설정", text: "⚡ 빠른 설정", level: 2 },
      { id: "완료", text: "✅ 완료", level: 3 }
    ]);
  });
});
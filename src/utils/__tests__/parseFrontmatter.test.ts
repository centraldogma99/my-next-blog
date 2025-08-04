import { describe, it, expect } from "vitest";
import { parseFrontmatter, isValidFrontmatter } from "../parseFrontmatter";

describe("parseFrontmatter", () => {
  it("유효한 frontmatter를 파싱한다", () => {
    const markdown = `---
title: "테스트 포스트"
date: "2023-01-01"
draft: false
tag:
- javascript
- react
---

# 테스트 내용

이것은 테스트 내용입니다.`;

    const result = parseFrontmatter(markdown);

    expect(result.frontmatter).toEqual({
      title: "테스트 포스트",
      date: "2023-01-01",
      draft: false,
      tag: ["javascript", "react"],
    });
    expect(result.content).toBe("# 테스트 내용\n\n이것은 테스트 내용입니다.");
  });

  it("subtitle이 있는 frontmatter를 파싱한다", () => {
    const markdown = `---
title: "메인 제목"
subtitle: "부제목"
date: "2023-01-01"
draft: false
tag:
- blog
---

내용`;

    const result = parseFrontmatter(markdown);

    expect(result.frontmatter.subtitle).toBe("부제목");
  });

  it("boolean 값을 올바르게 파싱한다", () => {
    const markdown = `---
title: "테스트"
date: "2023-01-01"
draft: true
tag:
- test
---

내용`;

    const result = parseFrontmatter(markdown);

    expect(result.frontmatter.draft).toBe(true);
  });

  it("frontmatter가 없으면 에러를 던진다", () => {
    const markdown = "# 제목\n\n내용";

    expect(() => parseFrontmatter(markdown)).toThrow("Invalid frontmatter");
  });

  it("필수 필드가 없으면 에러를 던진다", () => {
    const markdown = `---
title: "테스트"
---

내용`;

    expect(() => parseFrontmatter(markdown)).toThrow("Invalid frontmatter");
  });

  it("따옴표 없는 제목을 올바르게 파싱한다", () => {
    const markdown = `---
title: React Router loader와 Tanstack Query를 활용한 사용자 상태에 따른 리다이렉트 구현하기
date: 2025-08-01
draft: false
tag:
- react
- typescript
---

내용`;

    const result = parseFrontmatter(markdown);

    expect(result.frontmatter.title).toBe(
      "React Router loader와 Tanstack Query를 활용한 사용자 상태에 따른 리다이렉트 구현하기",
    );
    expect(result.frontmatter.date).toBe("2025-08-01");
  });

  it("빈 subtitle 값을 올바르게 파싱한다", () => {
    const markdown = `---
title: 테스트 제목
subtitle: 
date: 2025-08-01
draft: false
tag:
- test
---

내용`;

    const result = parseFrontmatter(markdown);

    expect(result.frontmatter.subtitle).toBe("");
    expect(result.frontmatter.title).toBe("테스트 제목");
  });

  it("작은 따옴표와 큰 따옴표가 섞여있어도 올바르게 파싱한다", () => {
    const markdown = `---
title: '작은 따옴표 제목'
subtitle: "큰 따옴표 부제목"
description: 따옴표 없는 설명
date: 2025-08-01
draft: false
tag:
- test
---

내용`;

    const result = parseFrontmatter(markdown);

    expect(result.frontmatter.title).toBe("작은 따옴표 제목");
    expect(result.frontmatter.subtitle).toBe("큰 따옴표 부제목");
    expect(result.frontmatter.description).toBe("따옴표 없는 설명");
  });

  it("중간에 따옴표가 포함된 텍스트를 올바르게 파싱한다", () => {
    const markdown = `---
title: JavaScript의 "this" 키워드와 '화살표 함수' 이해하기
subtitle: "Hello World"를 넘어선 'Real' 프로그래밍
description: It's a beautiful day, isn't it?
date: 2025-08-01
draft: false
tag:
- javascript
---

내용`;

    const result = parseFrontmatter(markdown);

    expect(result.frontmatter.title).toBe(
      "JavaScript의 \"this\" 키워드와 '화살표 함수' 이해하기",
    );
    expect(result.frontmatter.subtitle).toBe(
      "\"Hello World\"를 넘어선 'Real' 프로그래밍",
    );
    expect(result.frontmatter.description).toBe(
      "It's a beautiful day, isn't it?",
    );
  });

  it("양쪽 끝에 따옴표가 있고 중간에도 따옴표가 있는 경우", () => {
    const markdown = `---
title: "JavaScript의 'this' 키워드와 \"화살표 함수\" 이해하기"
subtitle: '프로그래밍에서 "따옴표"의 의미'
date: 2025-08-01
draft: false
tag:
- javascript
---

내용`;

    const result = parseFrontmatter(markdown);

    expect(result.frontmatter.title).toBe(
      "JavaScript의 'this' 키워드와 \"화살표 함수\" 이해하기",
    );
    expect(result.frontmatter.subtitle).toBe('프로그래밍에서 "따옴표"의 의미');
  });
});

describe("isValidFrontmatter", () => {
  it("유효한 frontmatter를 검증한다", () => {
    const validFrontmatter = {
      title: "제목",
      date: "2023-01-01",
      draft: false,
      tag: ["javascript"],
    };

    expect(isValidFrontmatter(validFrontmatter)).toBe(true);
  });

  it("필수 필드가 없으면 false를 반환한다", () => {
    const invalidFrontmatter = {
      title: "제목",
      date: "2023-01-01",
    };

    expect(isValidFrontmatter(invalidFrontmatter)).toBe(false);
  });

  it("잘못된 타입이면 false를 반환한다", () => {
    const invalidFrontmatter = {
      title: 123,
      date: "2023-01-01",
      draft: false,
      tag: ["javascript"],
    };

    expect(isValidFrontmatter(invalidFrontmatter)).toBe(false);
  });
});

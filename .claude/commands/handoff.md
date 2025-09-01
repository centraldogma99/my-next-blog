# 작업 마무리(CLAUDE.md 업데이트, Github PR 생성)

만약 커밋되지 않은 변경사항이 있다면, 적절한 커밋 메시지와 함께 커밋합니다.

그 후, 다음 두 작업을 병렬적으로 처리하세요:

- claude-md-updater 서브에이전트를 통해, CLAUDE.md에 변경이 필요한지를 확인하고 필요하다면 작업하세요.
- github-pr-manager 서브에이전트를 통해, Github PR을 생성하세요.

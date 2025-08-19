import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";
import { Octokit } from "octokit";
import { validateAuth, validateGitHubConfig } from "./index";

export interface HandlerContext {
  request: NextRequest;
  session: Session;
  accessToken: string;
  octokit: Octokit;
  githubConfig: {
    owner: string;
    repo: string;
  };
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export interface RouteHandlerOptions {
  requireAuth?: boolean;
  requireGitHub?: boolean;
}

type HandlerFunction<T = unknown> = (
  context: HandlerContext,
  params?: T,
) => Promise<NextResponse>;

/**
 * 인증된 라우트 핸들러를 생성하는 generator 함수
 * 인증, GitHub 설정 검증 등의 공통 로직을 자동으로 처리
 */
export function createAuthenticatedHandler<T = unknown>(
  handler: HandlerFunction<T>,
) {
  return async (
    request: NextRequest,
    context?: { params: Promise<T> },
  ): Promise<NextResponse> => {
    try {
      const authResult = await validateAuth(request);
      // 인증 실패 시
      if (authResult instanceof NextResponse) {
        return authResult;
      }
      const configResult = validateGitHubConfig();
      // 환경 변수 검증 실패 시
      if (configResult instanceof NextResponse) {
        return configResult;
      }
      const githubConfig = configResult;
      const { session, accessToken } = authResult;

      const octokit = new Octokit({
        auth: accessToken,
      });

      const params = context?.params ? await context.params : undefined;

      const handlerContext: HandlerContext = {
        request,
        session,
        accessToken,
        octokit,
        githubConfig,
        user: {
          name: session.user.name,
          email: session.user.email,
        },
      };

      // 실제 핸들러 실행
      return await handler(handlerContext, params);
    } catch (error) {
      console.error("Route handler error:", error);

      if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }

      return NextResponse.json(
        { message: "요청 처리 중 오류가 발생했습니다." },
        { status: 500 },
      );
    }
  };
}


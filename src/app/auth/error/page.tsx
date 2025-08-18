import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthError({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error;
  
  const errorMessages: Record<string, string> = {
    Configuration: "서버 설정에 문제가 있습니다. 관리자에게 문의하세요.",
    AccessDenied: "접근이 거부되었습니다. 허용된 사용자만 로그인할 수 있습니다.",
    Verification: "인증 토큰이 만료되었거나 이미 사용되었습니다.",
    Default: "로그인 중 오류가 발생했습니다.",
  };

  const message = error && errorMessages[error] 
    ? errorMessages[error] 
    : errorMessages.Default;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">로그인 오류</h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            {message}
          </p>
          
          {error === "Configuration" && (
            <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <p className="text-sm">
                GitHub OAuth 앱이 올바르게 설정되지 않았습니다.
                <br />
                GITHUB_ID와 GITHUB_SECRET 환경 변수를 확인하세요.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-2 bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
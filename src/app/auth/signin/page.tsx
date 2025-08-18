"use client";

import { signIn } from "next-auth/react";
import { Github } from "lucide-react";
import { useState } from "react";

export default function SignIn() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn("github", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">로그인</h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            GitHub 계정으로 로그인하여 블로그를 관리하세요
          </p>
        </div>
        
        <div className="mt-8">
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Github className="w-5 h-5" />
            {loading ? "로그인 중..." : "GitHub로 로그인"}
          </button>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>참고:</strong> 관리자로 등록된 GitHub 계정만 로그인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
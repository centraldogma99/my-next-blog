"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { LogIn, LogOut, Loader2 } from "lucide-react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    try {
      await signIn("github");
    } catch (error) {
      console.error("로그인 실패:", error);
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    setIsAuthenticating(true);
    try {
      await signOut();
    } catch (error) {
      console.error("로그아웃 실패:", error);
      setIsAuthenticating(false);
    }
  };

  if (status === "loading") {
    return (
      <button className="p-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] opacity-50 cursor-not-allowed">
        <div className="w-5 h-5 animate-spin">⏳</div>
      </button>
    );
  }

  if (session) {
    return (
      <button
        onClick={handleSignOut}
        disabled={isAuthenticating}
        className={`p-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] transition-all duration-200 flex items-center gap-2 ${
          isAuthenticating 
            ? 'cursor-wait opacity-70' 
            : 'hover:bg-[var(--color-primary-hover)] hover:text-white hover:border-[var(--color-primary)]'
        }`}
        title={isAuthenticating ? "로그아웃 중..." : `로그아웃 (${session.user?.username})`}
      >
        {isAuthenticating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="hidden sm:inline">로그아웃 중...</span>
          </>
        ) : (
          <>
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">{session.user?.username}</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isAuthenticating}
      className={`p-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] transition-all duration-200 flex items-center gap-2 ${
        isAuthenticating 
          ? 'cursor-wait opacity-70' 
          : 'hover:bg-[var(--color-primary-hover)] hover:text-white hover:border-[var(--color-primary)]'
      }`}
      title={isAuthenticating ? "로그인 중..." : "GitHub로 로그인"}
    >
      {isAuthenticating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="hidden sm:inline">로그인 중...</span>
        </>
      ) : (
        <>
          <LogIn className="w-5 h-5" />
          <span className="hidden sm:inline">Github 로그인</span>
        </>
      )}
    </button>
  );
}

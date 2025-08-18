"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { LogIn, LogOut } from "lucide-react";

export default function AuthButton() {
  const { data: session, status } = useSession();

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
        onClick={() => signOut()}
        className="p-2 rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] transition-colors flex items-center gap-2"
        title={`로그아웃 (${session.user?.username})`}
      >
        <LogOut className="w-5 h-5" />
        <span className="hidden sm:inline">{session.user?.username}</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="p-2 rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] transition-colors flex items-center gap-2"
      title="GitHub로 로그인"
    >
      <LogIn className="w-5 h-5" />
      <span className="hidden sm:inline">로그인</span>
    </button>
  );
}
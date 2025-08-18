import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // 허용된 사용자만 로그인 허용
      const allowedUsers = process.env.ALLOWED_USERS?.split(",") || [];
      const githubUsername = profile?.login as string;
      
      if (allowedUsers.includes(githubUsername)) {
        return true;
      }
      
      return false;
    },
    async session({ session, token }) {
      // 세션에 GitHub 사용자명과 액세스 토큰 추가
      if (token) {
        session.user = {
          ...session.user,
          username: token.username as string,
        };
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      // JWT 토큰에 GitHub 정보 저장
      if (account && profile) {
        token.accessToken = account.access_token;
        token.username = profile.login;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
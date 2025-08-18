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
    async signIn({ user }) {
      // 허용된 이메일만 로그인 허용
      const allowedEmails =
        process.env.ALLOWED_EMAILS?.split(",").map((email) => email.trim()) ||
        [];
      const userEmail = user?.email;

      if (userEmail && allowedEmails.includes(userEmail)) {
        return true;
      }

      return false;
    },
    async session({ session, token }) {
      // 세션에 GitHub 사용자명과 액세스 토큰 추가
      if (token) {
        // 관리자 권한 확인
        const allowedEmails =
          process.env.ALLOWED_EMAILS?.split(",").map((email) => email.trim()) ||
          [];
        const isAdmin = session.user?.email 
          ? allowedEmails.includes(session.user.email) 
          : false;

        session.user = {
          ...session.user,
          username: token.username as string,
          isAdmin,
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

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";

import { Session } from "next-auth";

export interface AuthResult {
  session: Session;
  accessToken: string;
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export async function validateAuth(request: NextRequest): Promise<AuthResult | NextResponse> {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { message: "인증되지 않은 요청입니다." },
      { status: 401 }
    );
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (!token?.accessToken) {
    return NextResponse.json(
      { message: "인증 토큰이 없습니다." },
      { status: 401 }
    );
  }

  return {
    session,
    accessToken: token.accessToken as string,
    user: {
      name: session.user?.name,
      email: session.user?.email
    }
  };
}
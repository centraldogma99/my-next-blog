import { type Session } from "next-auth";

// 관리자 이메일 목록
// 환경 변수 ADMIN_EMAILS에 쉼표로 구분된 이메일 목록을 설정할 수 있음
// 예: ADMIN_EMAILS="user1@example.com,user2@example.com"
const getAdminEmails = (): string[] => {
  const envAdmins = process.env.ALLOWED_EMAILS;

  if (envAdmins) {
    return envAdmins.split(",").map((email) => email.trim());
  } else return [];
};

export function isAdmin(session: Session | null): boolean {
  // 클라이언트에서는 세션의 isAdmin 플래그를 사용
  // 서버에서는 process.env.ALLOWED_EMAILS 체크를 수행
  if (typeof window !== "undefined") {
    // 클라이언트 환경
    return session?.user?.isAdmin === true;
  }
  
  // 서버 환경
  if (!session?.user?.email) {
    return false;
  }

  const adminEmails = getAdminEmails();
  return adminEmails.includes(session.user.email);
}

export function canCreatePost(session: Session | null): boolean {
  // 현재는 관리자만 글을 작성할 수 있도록 설정
  // 향후 작가 권한 등을 추가할 수 있음
  return isAdmin(session);
}

export function canEditPost(
  session: Session | null,
  authorEmail?: string,
): boolean {
  if (!session?.user?.email) {
    return false;
  }

  // 관리자는 모든 포스트 편집 가능
  if (isAdmin(session)) {
    return true;
  }

  // 작성자 본인은 자신의 포스트 편집 가능 (향후 기능)
  if (authorEmail && session.user.email === authorEmail) {
    return true;
  }

  return false;
}

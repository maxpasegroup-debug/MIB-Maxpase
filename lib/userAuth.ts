/**
 * Student/Parent auth: session cookie for /dashboard.
 * Separate from admin auth.
 */

export const USER_COOKIE_NAME = "career_user_session";

/** Test account that bypasses payment and sees all reports (full report + PDF). */
export const TEST_BYPASS_EMAIL = "nafi@mib2.in";

export interface CareerUserSession {
  userId: string;
  email: string;
  name: string;
  role: string;
}

function parseSessionFromCookie(cookieHeader: string | null): CareerUserSession | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${USER_COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  try {
    const decoded = decodeURIComponent(match[1].trim());
    const data = JSON.parse(decoded) as unknown;
    if (
      data &&
      typeof data === "object" &&
      "userId" in data &&
      typeof (data as CareerUserSession).userId === "string" &&
      "email" in data &&
      "name" in data &&
      "role" in data
    ) {
      return data as CareerUserSession;
    }
  } catch {
    // ignore
  }
  return null;
}

/** Parse session from cookie (value is JSON). */
export function getUserSession(request: Request): CareerUserSession | null {
  return parseSessionFromCookie(request.headers.get("cookie"));
}

/** Parse session from Next.js headers() for use in server components. */
export function getSessionFromHeaders(
  headers: { get(name: string): string | null }
): CareerUserSession | null {
  return parseSessionFromCookie(headers.get("cookie"));
}

/** True if this session should bypass payment and see all reports (test account). */
export function canBypassPayments(session: CareerUserSession | null): boolean {
  return session?.email?.toLowerCase() === TEST_BYPASS_EMAIL.toLowerCase();
}

export function isUserAuthenticated(request: Request): boolean {
  return getUserSession(request) !== null;
}

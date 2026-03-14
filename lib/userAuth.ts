/**
 * Student/Parent auth: session cookie for /dashboard.
 * Separate from admin auth.
 */

export const USER_COOKIE_NAME = "career_user_session";

export interface CareerUserSession {
  userId: string;
  email: string;
  name: string;
  role: string;
}

/** Parse session from cookie (value is JSON). */
export function getUserSession(request: Request): CareerUserSession | null {
  const cookieHeader = request.headers.get("cookie");
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

export function isUserAuthenticated(request: Request): boolean {
  return getUserSession(request) !== null;
}

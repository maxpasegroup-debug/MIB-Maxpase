/**
 * Institute auth: session cookie for /institutes/*.
 * Used by institute dashboard and APIs.
 */

export const INSTITUTE_COOKIE_NAME = "institute_session";

export interface InstituteSession {
  instituteId: string;
  name: string;
  email: string;
}

function parseCookieValue(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader.match(
    new RegExp(`${INSTITUTE_COOKIE_NAME}=([^;]+)`)
  );
  return match ? decodeURIComponent(match[1].trim()) : null;
}

/**
 * Get institute session from request. Returns null if not authenticated.
 * For full institute details (e.g. name), use the dashboard API or DB.
 */
export function getInstituteSession(request: Request): { instituteId: string } | null {
  const value = parseCookieValue(request);
  if (!value) return null;
  return { instituteId: value };
}

export function isInstituteAuthenticated(request: Request): boolean {
  return getInstituteSession(request) !== null;
}

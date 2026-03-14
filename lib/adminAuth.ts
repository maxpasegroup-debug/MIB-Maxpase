/**
 * Admin auth: cookie name and helpers.
 * Used by middleware and login API.
 */

export const ADMIN_COOKIE_NAME = "admin_session";
export const ADMIN_COOKIE_VALUE = "authenticated";

export function getAdminToken(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  return match ? match[1].trim() : null;
}

export function isAdminAuthenticated(request: Request): boolean {
  const token = getAdminToken(request);
  return token === ADMIN_COOKIE_VALUE;
}

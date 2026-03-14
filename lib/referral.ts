/**
 * Referral partner link and cookie names.
 */

export const REF_COOKIE_NAME = "ref_partner_id";
export const PARTNER_SESSION_COOKIE = "partner_session";

const BASE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL ?? "https://yourdomain.com";

/**
 * Generate referral link for a partner.
 * Used on partner dashboard.
 */
export function generateReferralLink(partnerId: string): string {
  const url = new URL(BASE_URL);
  url.searchParams.set("ref", partnerId);
  return url.toString();
}

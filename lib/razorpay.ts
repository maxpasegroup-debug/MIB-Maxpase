/**
 * Razorpay client for MIB Career Intelligence payment (₹499).
 * Uses RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET from env.
 */

import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export const razorpay =
  keyId && keySecret
    ? new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      })
    : null;

export function isRazorpayConfigured(): boolean {
  return Boolean(razorpay);
}

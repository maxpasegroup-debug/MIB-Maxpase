"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay?: {
      new (options: {
        key: string;
        amount: number;
        order_id: string;
        name: string;
        description: string;
        handler: (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => void;
      }): { open: () => void };
    };
  }
}

const UNLOCK_FEATURES = [
  "10D Career Intelligence Profile",
  "Potential Personality Profile",
  "Career Probability Model",
  "Life Path Simulation",
  "Strategic AI Career Report",
  "Downloadable PDF Intelligence Dossier",
];

interface ReportUnlockProps {
  sessionId: string;
}

export default function ReportUnlock({ sessionId }: ReportUnlockProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRazorpayScript = useCallback((): Promise<void> => {
    if (typeof window === "undefined") return Promise.reject(new Error("No window"));
    if (window.Razorpay) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay"));
      document.body.appendChild(script);
    });
  }, []);

  const handleUnlock = async () => {
    setError(null);
    setLoading(true);
    try {
      const orderRes = await fetch("/api/career-10d/unlock-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order");
      const { orderId, amount, currency, key } = orderData;
      if (!orderId || !key) throw new Error("Invalid order response");

      await loadRazorpayScript();

      await new Promise<void>((resolve, reject) => {
        const options = {
          key,
          amount,
          currency,
          order_id: orderId,
          name: "MIB Career Intelligence",
          description: "Unlock Full Career Report – ₹499",
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json();
              if (!verifyRes.ok || !verifyData.success) {
                reject(new Error("Payment verification failed"));
                return;
              }
              resolve();
            } catch (e) {
              reject(e);
            }
          },
        };
        const rzp = window.Razorpay ? new window.Razorpay(options) : null;
        if (!rzp) {
          reject(new Error("Razorpay not loaded"));
          return;
        }
        const rzpAny = rzp as unknown as { on: (e: string, cb: () => void) => void };
        rzpAny.on("payment.failed", () => reject(new Error("Payment failed")));
        rzp.open();
      });

      router.refresh();
      setLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-xl border-2 border-purple-200 p-6 sm:p-8 relative z-10">
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Unlock Your Full Career Intelligence Report
      </h2>
      <p className="text-gray-600 mb-6">
        You’ve completed the assessment. Pay once to access the full report and PDF download.
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
        <div>
          <span className="text-3xl font-bold text-purple-600">₹499</span>
          <span className="text-gray-500 ml-1">one-time</span>
        </div>
        <ul className="space-y-2 text-sm text-gray-700">
          {UNLOCK_FEATURES.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="text-green-600 font-medium">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-4" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleUnlock}
        disabled={loading}
        className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-purple-600 px-8 py-4 text-white font-semibold hover:bg-purple-700 disabled:opacity-60 disabled:pointer-events-none"
      >
        {loading ? "Opening payment…" : "Unlock Full Report"}
      </button>
    </section>
  );
}

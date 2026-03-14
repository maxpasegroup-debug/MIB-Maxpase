"use client";

import { Suspense, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const STORAGE_KEY_PREFIX = "career10d_";

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

const FEATURES = [
  "10D Career Profiling",
  "AI Career Report",
  "Career Roadmap",
  "Parent Guidance",
];

function CareerIntelligenceStartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const instituteTestId = useMemo(
    () => searchParams.get("instituteTestId"),
    [searchParams]
  );
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

  const handlePayAndStart = async () => {
    setError(null);
    setLoading(true);
    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "career_intelligence" }),
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
          description: "Career Intelligence Test – ₹499",
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
              if (process.env.NODE_ENV === "development") {
                console.debug("[career-intelligence/start] Payment verified");
              }

              const startRes = await fetch("/api/career-10d/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  ...(instituteTestId && { instituteTestId }),
                }),
              });
              const startData = await startRes.json();
              if (!startRes.ok) throw new Error(startData.error || "Failed to start test");
              const { sessionId, questions } = startData;
              if (!sessionId || !questions?.length) throw new Error("Invalid start response");
              if (process.env.NODE_ENV === "development") {
                console.debug("[career-intelligence/start] Session started", sessionId);
              }
              try {
                sessionStorage.setItem(
                  `${STORAGE_KEY_PREFIX}${sessionId}`,
                  JSON.stringify(questions)
                );
              } catch {
                // ignore
              }
              router.push(`/career-intelligence/test/${sessionId}`);
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
        rzp.open();
        const rzpAny = rzp as { open: () => void; on?: (e: string, cb: () => void) => void };
        if (rzpAny.on) {
          rzpAny.on("payment.failed", () => reject(new Error("Payment failed")));
          rzpAny.on("modal.closed", () => reject(new Error("Payment cancelled")));
        }
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              Career Intelligence Test
            </h1>
            <p className="text-3xl font-bold text-purple-600 mb-6">₹499</p>
            <ul className="space-y-2 mb-8">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            {error && (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            )}
            <button
              type="button"
              onClick={handlePayAndStart}
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-4 text-white font-semibold shadow-lg disabled:opacity-70"
            >
              {loading ? "Opening payment…" : "Pay ₹499 and Start Test"}
            </button>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          You will answer 80 questions. Allow about 15–20 minutes.
        </p>
        <Link
          href="/career-intelligence"
          className="mt-8 block text-center text-purple-600 font-medium"
        >
          ← Back to Career Intelligence
        </Link>
      </div>
    </main>
  );
}

export default function CareerIntelligenceStartPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center px-4 py-12">
          <div className="max-w-md w-full animate-pulse rounded-2xl bg-white shadow-xl border border-gray-100 h-80" />
        </main>
      }
    >
      <CareerIntelligenceStartContent />
    </Suspense>
  );
}

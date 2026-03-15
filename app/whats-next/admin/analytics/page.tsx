import { redirect } from "next/navigation";
import { WHATS_NEXT_BASE } from "@/lib/basePath";

export default function AdminAnalyticsPage() {
  redirect(`${WHATS_NEXT_BASE}/admin/dashboard`);
}

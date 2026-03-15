import MainDashboard from "@/components/dashboard/MainDashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainDashboard>{children}</MainDashboard>;
}

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { requireAppUser } from "@/lib/auth-user";
import { DashboardShell } from "@/components/shared/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user;
  try {
    user = await requireAppUser();
  } catch {
    redirect("/sign-in");
  }
  if (!user.isOnboarded) {
    redirect("/onboarding");
  }

  return (
    <DashboardShell user={user}>{children}</DashboardShell>
  );
}

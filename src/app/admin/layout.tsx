import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: "Marnie Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <AdminNav />
      <div className="flex-1 overflow-x-hidden p-4 md:p-8">{children}</div>
    </div>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountDashboard } from "@/components/account/account-dashboard";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({ title: "My Account", path: "/account" }),
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold">Hi, gorgeous ✨</h1>
        <p className="text-muted-foreground">
          Manage your orders, wishlist, Glow Points and referrals.
        </p>
      </header>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted" />}>
        <AccountDashboard />
      </Suspense>
    </div>
  );
}

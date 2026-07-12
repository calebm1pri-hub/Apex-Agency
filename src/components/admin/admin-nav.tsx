"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Mail,
  Clapperboard,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/seeding", label: "Creator Seeding", icon: Users },
  { href: "/admin/outreach", label: "Outreach Generator", icon: Mail },
  { href: "/admin/seedance", label: "Seedance Studio", icon: Clapperboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <aside className="flex w-full shrink-0 flex-col gap-1 border-b border-border bg-card p-4 md:h-dvh md:w-64 md:border-b-0 md:border-r">
      <Link href="/admin" className="mb-4 flex items-center gap-2 px-2">
        <Logo className="text-xl" />
        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-foreground">
          Admin
        </span>
      </Link>
      <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <Link
        href="/"
        className="mt-auto hidden items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent md:flex"
      >
        <ExternalLink className="h-4 w-4" /> View storefront
      </Link>
    </aside>
  );
}

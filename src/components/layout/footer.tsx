import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/marketing/newsletter-form";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop?category=lashes", label: "Lash Clusters" },
      { href: "/shop?category=cheeks", label: "Cream Blush" },
      { href: "/shop?category=brushes", label: "Brush Sets" },
      { href: "/shop?category=sets", label: "Glow Kits" },
      { href: "/bundle-builder", label: "Build a Bundle" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/blog", label: "Glow Guide" },
      { href: "/tiktok", label: "As Seen on TikTok" },
      { href: "/blog/5-minute-glow-up-routine", label: "5-Min Routine" },
      { href: "/account", label: "Track Order" },
    ],
  },
  {
    title: "Creators",
    links: [
      { href: "/creators/apply", label: "Become a Creator" },
      { href: "/account?tab=referrals", label: "Refer & Earn" },
      { href: "/tiktok", label: "Creator Showcase" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "Our Story" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div className="space-y-4">
            <Logo className="text-3xl" />
            <p className="max-w-sm text-sm text-muted-foreground">
              Easy, clean, affordable glam. Join <b>the glow list</b> for early
              drops, TikTok-exclusive codes, and 15% off your first order.
            </p>
            <NewsletterForm />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-3 text-sm font-semibold">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Marnie Beauty. Cruelty-free & vegan.</p>
          <div className="flex items-center gap-4">
            <a href="https://www.tiktok.com/@marnie.beauty" className="hover:text-primary">
              TikTok
            </a>
            <a href="https://www.instagram.com/marnie.beauty" className="hover:text-primary">
              Instagram
            </a>
            <Link href="/admin" className="hover:text-primary">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

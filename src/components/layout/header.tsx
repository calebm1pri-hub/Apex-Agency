"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Search, User, Heart } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { CartButton } from "@/components/layout/cart-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=lashes", label: "Lashes" },
  { href: "/shop?category=sets", label: "Kits" },
  { href: "/tiktok", label: "As Seen on TikTok" },
  { href: "/blog", label: "Glow Guide" },
];

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Announcement bar — rotating urgency + free-ship hook */}
      <div className="bg-gradient-to-r from-blush-500 via-rose-400 to-nude-300 py-2 text-center text-xs font-medium text-white">
        ✨ Free shipping over $35 · Get a free Mini Brush with your first order — code{" "}
        <b>GLOWUP</b>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b transition-colors",
          scrolled
            ? "border-border bg-background/85 backdrop-blur-lg"
            : "border-transparent bg-background/60 backdrop-blur"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          {/* Mobile menu */}
          <div className="flex items-center gap-1 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-2 flex flex-col gap-1">
                  {nav.map((item) => (
                    <SheetTrigger asChild key={item.href}>
                      <Link
                        href={item.href}
                        className="rounded-xl px-3 py-3 text-base font-medium hover:bg-accent"
                      >
                        {item.label}
                      </Link>
                    </SheetTrigger>
                  ))}
                  <SheetTrigger asChild>
                    <Link
                      href="/creators/apply"
                      className="rounded-xl px-3 py-3 text-base font-medium hover:bg-accent"
                    >
                      Become a Creator
                    </Link>
                  </SheetTrigger>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon" aria-label="Search" asChild>
              <Link href="/shop">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Wishlist"
              asChild
              className="hidden sm:inline-flex"
            >
              <Link href="/account?tab=wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Account"
              asChild
              className="hidden sm:inline-flex"
            >
              <Link href="/account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <CartButton />
          </div>
        </div>
      </header>
    </>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/home/section";

const cats = [
  {
    href: "/shop?category=lashes",
    label: "Lash Clusters",
    img: "https://images.unsplash.com/photo-1583241800698-9c2e0b3f9b6a?auto=format&fit=crop&w=600&q=80",
  },
  {
    href: "/shop?category=cheeks",
    label: "Cream Blush",
    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
  },
  {
    href: "/shop?category=brushes",
    label: "Brush Sets",
    img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80",
  },
  {
    href: "/shop?category=tools",
    label: "Hybrid Tools",
    img: "https://images.unsplash.com/photo-1631214540553-ff044a3ff1d4?auto=format&fit=crop&w=600&q=80",
  },
  {
    href: "/shop?category=lips",
    label: "Lip Oils",
    img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
  },
  {
    href: "/shop?category=sets",
    label: "Glow Kits",
    img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80",
  },
];

export function Categories() {
  return (
    <Section eyebrow="Shop by category" title="Find your everyday essentials">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cats.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-border"
          >
            <Image
              src={c.img}
              alt={c.label}
              fill
              sizes="(max-width:768px) 45vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 p-3 text-center text-sm font-semibold text-white">
              {c.label}
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

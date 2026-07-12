import type { Order } from "@/types";

/** MOCK orders — powers the customer account + admin orders view. */
export const orders: Order[] = [
  {
    id: "MRN-10432",
    date: "2026-07-08",
    status: "shipped",
    total: 69,
    trackingUrl: "https://tools.usps.com/go/TrackConfirmAction",
    items: [
      {
        name: "The 5-Minute Glow Kit",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=200&q=80",
      },
    ],
  },
  {
    id: "MRN-10388",
    date: "2026-06-24",
    status: "delivered",
    total: 43,
    items: [
      {
        name: "Featherlight Lash Clusters",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1583241800698-9c2e0b3f9b6a?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Glaze Tinted Lip Oil",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=200&q=80",
      },
    ],
  },
  {
    id: "MRN-10201",
    date: "2026-05-30",
    status: "delivered",
    total: 29,
    items: [
      {
        name: "Mini Glow Brush Set",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=200&q=80",
      },
    ],
  },
];

export function getOrders() {
  return orders;
}

/** Admin view: recent orders across all customers (mock). */
export const adminOrders: (Order & { customer: string; channel: string })[] = [
  { ...orders[0], customer: "marnie.fan@email.com", channel: "TikTok Shop" },
  { ...orders[1], customer: "glowgirl@email.com", channel: "Website" },
  { ...orders[2], customer: "beautybuyer@email.com", channel: "TikTok Shop" },
  {
    id: "MRN-10450",
    date: "2026-07-11",
    status: "processing",
    total: 52,
    customer: "newcustomer@email.com",
    channel: "Website",
    items: [
      {
        name: "Cloud Cream Blush",
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=200&q=80",
      },
    ],
  },
];

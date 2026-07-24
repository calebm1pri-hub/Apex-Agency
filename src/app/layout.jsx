export const metadata = {
  title: "Navigator — Perimenopause & Menopause Companion",
  description:
    "A private, on-device companion for perimenopause and menopause. Track symptoms, mood, sleep and HRT, forecast harder days, spot your patterns, and generate doctor-ready reports. Your data never leaves your device.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5b3a5b",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}

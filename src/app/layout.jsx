export const metadata = {
  title: "APEX — AI-Powered Marketing for South Florida Businesses",
  description: "Get more customers with AI-powered content, automation, and lead generation. Starting at $500/month. No contracts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}

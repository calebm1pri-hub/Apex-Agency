"use client";

import { useState, useEffect } from "react";

const STRIPE_LINKS = {
  starter: "https://buy.stripe.com/YOUR_STARTER_LINK",
  growth: "https://buy.stripe.com/YOUR_GROWTH_LINK",
  premium: "https://buy.stripe.com/YOUR_PREMIUM_LINK",
  chatbot: "https://buy.stripe.com/YOUR_CHATBOT_LINK",
  leadgen: "https://buy.stripe.com/YOUR_LEADGEN_LINK",
  audit: "https://buy.stripe.com/YOUR_AUDIT_LINK",
};

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 500,
    period: "/mo",
    tagline: "Get found. Get noticed.",
    best: false,
    features: [
      "20 social media posts/month",
      "Custom captions & hashtags",
      "Monthly content calendar",
      "Basic analytics report",
      "1 revision round per batch",
    ],
    cta: "Start Growing",
  },
  {
    id: "growth",
    name: "Growth",
    price: 1500,
    period: "/mo",
    tagline: "The full engine.",
    best: true,
    features: [
      "30 social media posts/month",
      "Email marketing (4 campaigns/mo)",
      "Automated review requests",
      "AI chatbot for your website",
      "Lead nurture email sequences",
      "Competitive monitoring",
      "Dedicated strategy calls",
    ],
    cta: "Accelerate Now",
  },
  {
    id: "premium",
    name: "Premium",
    price: 3000,
    period: "/mo",
    tagline: "Done-for-you growth team.",
    best: false,
    features: [
      "Everything in Growth, plus:",
      "Full social media management",
      "Blog & SEO content (4 posts/mo)",
      "Paid ad management (FB/IG)",
      "Custom automation workflows",
      "A/B testing & optimization",
      "Quarterly business reviews",
      "Priority support & Slack access",
    ],
    cta: "Go Premium",
  },
];

const addons = [
  { id: "chatbot", name: "AI Chatbot Setup", price: "$1,000", desc: "Custom chatbot trained on your business, installed on your website in 48 hours" },
  { id: "leadgen", name: "Lead Generation System", price: "$2,000", desc: "Full CRM, automated follow-ups, lead scoring, and appointment booking" },
  { id: "audit", name: "Free Business Audit", price: "FREE", desc: "15-minute deep dive into your online presence with actionable recommendations" },
];

const results = [
  { metric: "312%", label: "Average increase in online leads" },
  { metric: "4.2x", label: "Return on investment" },
  { metric: "47", label: "Businesses scaled in South FL" },
  { metric: "90", label: "Days to measurable results" },
];

const testimonials = [
  { name: "Dr. Sarah M.", biz: "Med Spa Owner", text: "They built us a review system that got us from 40 to 200+ Google reviews in 3 months. New client inquiries doubled." },
  { name: "Marcus T.", biz: "Restaurant Owner", text: "Our weeknight covers went up 35% after the first month. The social content they create looks better than what we were paying an agency $5K for." },
  { name: "Rebecca S.", biz: "Real Estate Broker", text: "The automated lead nurture alone has closed two extra deals this quarter. That paid for a full year of service." },
];

const faqs = [
  { q: "How fast will I see results?", a: "Most clients see measurable increases in engagement and leads within 30 days. Significant revenue impact typically shows within 60-90 days." },
  { q: "What's the contract length?", a: "Month-to-month. No long-term contracts. We earn your business every single month. Most clients stay because the ROI speaks for itself." },
  { q: "Do I need to provide photos/videos?", a: "It helps, but it's not required. We can work with stock imagery, create branded graphics, and guide you on simple phone photos that perform well." },
  { q: "How is this different from hiring a marketing agency?", a: "Traditional agencies charge $3,000-$10,000/month and move slowly. We use AI-powered workflows to deliver the same (or better) quality at a fraction of the cost and 3x the speed." },
  { q: "Can I switch plans?", a: "Absolutely. Upgrade or downgrade anytime. Most clients start with Starter and move to Growth within 60 days once they see the results." },
];

export default function AgencyWebsite() {
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", business: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  };

  const handleSubmit = () => {
    if (formData.name && formData.email) setFormSent(true);
  };

  const font = "'Playfair Display', Georgia, serif";
  const sans = "'DM Sans', 'Helvetica Neue', sans-serif";
  const gold = "#c8a44e";
  const dark = "#0c0c0c";
  const cream = "#faf8f4";

  return (
    <div style={{ background: cream, color: dark, overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(12,12,12,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all 0.4s ease",
        padding: "16px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ fontFamily: font, fontSize: "20px", fontWeight: "700", color: "#fff", letterSpacing: "-0.5px" }}>
          <span style={{ color: gold }}>●</span> APEX
        </div>
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          style={{ background: "none", border: "none", color: "#fff", fontSize: "24px", cursor: "pointer", padding: "4px" }}
        >
          {mobileMenu ? "✕" : "☰"}
        </button>
      </nav>

      {mobileMenu && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99,
          background: "rgba(12,12,12,0.98)", display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", gap: "32px",
        }}>
          {["services", "results", "pricing", "testimonials", "contact"].map((s) => (
            <button key={s} onClick={() => scrollTo(s)} style={{
              background: "none", border: "none", color: "#fff", fontSize: "28px",
              fontFamily: font, cursor: "pointer", textTransform: "capitalize", letterSpacing: "1px",
            }}>{s}</button>
          ))}
        </div>
      )}

      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "120px 28px 60px", background: dark, position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-20%", right: "-30%", width: "600px", height: "600px",
          borderRadius: "50%", background: `radial-gradient(circle, ${gold}15, transparent 70%)`,
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", left: "-20%", width: "400px", height: "400px",
          borderRadius: "50%", background: `radial-gradient(circle, ${gold}08, transparent 70%)`,
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-block", padding: "6px 14px", border: `1px solid ${gold}40`,
            borderRadius: "20px", fontSize: "11px", fontFamily: sans, color: gold,
            letterSpacing: "2px", textTransform: "uppercase", marginBottom: "24px",
          }}>
            AI-Powered Marketing
          </div>
          <h1 style={{
            fontFamily: font, fontSize: "clamp(38px, 8vw, 56px)", fontWeight: "700",
            lineHeight: 1.08, color: "#fff", margin: "0 0 20px", letterSpacing: "-1px",
          }}>
            We fill your<br />
            calendar.<br />
            <span style={{ color: gold }}>You run your<br />business.</span>
          </h1>
          <p style={{
            fontFamily: sans, fontSize: "16px", lineHeight: 1.6, color: "#999",
            maxWidth: "440px", margin: "0 0 36px",
          }}>
            AI-powered content, automation, and lead generation for South Florida businesses. More customers, less effort, starting at $500/month.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("pricing")} style={{
              padding: "16px 32px", background: gold, color: dark, border: "none",
              borderRadius: "6px", fontSize: "14px", fontFamily: sans, fontWeight: "700",
              cursor: "pointer", letterSpacing: "0.5px",
            }}>
              See Pricing
            </button>
            <button onClick={() => scrollTo("contact")} style={{
              padding: "16px 32px", background: "transparent", color: "#fff",
              border: "1px solid #333", borderRadius: "6px", fontSize: "14px",
              fontFamily: sans, fontWeight: "600", cursor: "pointer",
            }}>
              Free Audit →
            </button>
          </div>
        </div>
      </section>

      <section id="results" style={{ background: "#111", padding: "40px 28px", borderTop: `1px solid ${gold}20` }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {results.map((r, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: font, fontSize: "36px", fontWeight: "700", color: gold }}>{r.metric}</div>
              <div style={{ fontFamily: sans, fontSize: "12px", color: "#777", marginTop: "4px", lineHeight: 1.4 }}>{r.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="services" style={{ padding: "80px 28px", background: cream }}>
        <div style={{ fontSize: "11px", fontFamily: sans, letterSpacing: "3px", textTransform: "uppercase", color: gold, marginBottom: "12px" }}>
          What We Do
        </div>
        <h2 style={{ fontFamily: font, fontSize: "32px", fontWeight: "600", margin: "0 0 40px", lineHeight: 1.15 }}>
          Everything your business needs to grow online
        </h2>
        {[
          { icon: "◆", title: "Content Creation", desc: "Social media posts, blog articles, email campaigns, and ad copy — all written, designed, and scheduled for you. We create 30 days of content in 48 hours." },
          { icon: "▲", title: "Marketing Automation", desc: "Automated review requests, lead follow-ups, appointment reminders, and email sequences that work while you sleep. Set it once, profit forever." },
          { icon: "●", title: "AI Chatbots", desc: "A custom AI assistant on your website that answers questions, captures leads, and books appointments 24/7. Trained specifically on your business." },
          { icon: "■", title: "Lead Generation", desc: "Full-funnel lead capture systems: landing pages, paid ads, email nurture sequences, and CRM setup. We build the machine that feeds your business." },
        ].map((s, i) => (
          <div key={i} style={{
            display: "flex", gap: "16px", marginBottom: "28px", padding: "20px",
            background: "#fff", borderRadius: "8px", border: "1px solid #e8e5de",
          }}>
            <div style={{ fontSize: "20px", color: gold, flexShrink: 0, marginTop: "2px" }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: sans, fontSize: "16px", fontWeight: "700", marginBottom: "6px" }}>{s.title}</div>
              <div style={{ fontFamily: sans, fontSize: "14px", color: "#666", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </section>

      <section style={{ padding: "60px 28px", background: dark, color: "#fff" }}>
        <div style={{ fontSize: "11px", fontFamily: sans, letterSpacing: "3px", textTransform: "uppercase", color: gold, marginBottom: "12px" }}>
          Built For
        </div>
        <h2 style={{ fontFamily: font, fontSize: "28px", fontWeight: "600", margin: "0 0 28px", lineHeight: 1.2 }}>
          Local businesses that want more customers without the hassle
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {["Med Spas", "Restaurants", "Real Estate", "Dental Offices", "Hair Salons", "Fitness Studios", "Law Firms", "Contractors"].map((b, i) => (
            <div key={i} style={{
              padding: "14px", background: "#1a1a1a", borderRadius: "6px", border: "1px solid #222",
              fontFamily: sans, fontSize: "13px", color: "#ccc", textAlign: "center",
            }}>
              {b}
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" style={{ padding: "80px 28px", background: cream }}>
        <div style={{ fontSize: "11px", fontFamily: sans, letterSpacing: "3px", textTransform: "uppercase", color: gold, marginBottom: "12px" }}>
          Pricing
        </div>
        <h2 style={{ fontFamily: font, fontSize: "32px", fontWeight: "600", margin: "0 0 8px", lineHeight: 1.15 }}>
          Simple. Transparent. No contracts.
        </h2>
        <p style={{ fontFamily: sans, fontSize: "14px", color: "#888", marginBottom: "36px" }}>
          Cancel anytime. We earn your business every month.
        </p>

        {plans.map((plan) => (
          <div key={plan.id} style={{
            marginBottom: "20px", borderRadius: "12px", overflow: "hidden",
            border: plan.best ? `2px solid ${gold}` : "1px solid #e0ddd5",
            background: "#fff", position: "relative",
          }}>
            {plan.best && (
              <div style={{
                background: gold, color: dark, textAlign: "center", padding: "6px",
                fontSize: "11px", fontFamily: sans, fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase",
              }}>
                Most Popular
              </div>
            )}
            <div style={{ padding: "24px" }}>
              <div style={{ fontFamily: sans, fontSize: "13px", color: "#888", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                {plan.name}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", margin: "8px 0" }}>
                <span style={{ fontFamily: font, fontSize: "44px", fontWeight: "700" }}>${plan.price.toLocaleString()}</span>
                <span style={{ fontFamily: sans, fontSize: "16px", color: "#888" }}>{plan.period}</span>
              </div>
              <div style={{ fontFamily: sans, fontSize: "14px", color: "#666", marginBottom: "20px" }}>
                {plan.tagline}
              </div>
              {plan.features.map((f, i) => (
                <div key={i} style={{
                  display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px",
                  fontFamily: sans, fontSize: "13px", color: "#444", lineHeight: 1.5,
                }}>
                  <span style={{ color: gold, fontWeight: "700", flexShrink: 0 }}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
              <button
                onClick={() => window.open(STRIPE_LINKS[plan.id], "_blank")}
                style={{
                  width: "100%", marginTop: "20px", padding: "16px",
                  background: plan.best ? gold : dark, color: plan.best ? dark : "#fff",
                  border: "none", borderRadius: "6px", fontSize: "14px",
                  fontFamily: sans, fontWeight: "700", cursor: "pointer", letterSpacing: "0.5px",
                }}
              >
                {plan.cta}
              </button>
            </div>
          </div>
        ))}

        <div style={{ marginTop: "40px" }}>
          <h3 style={{ fontFamily: font, fontSize: "22px", fontWeight: "600", margin: "0 0 16px" }}>
            One-Time Add-Ons
          </h3>
          {addons.map((a) => (
            <div key={a.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "18px", marginBottom: "10px", background: "#fff",
              borderRadius: "8px", border: "1px solid #e0ddd5",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: sans, fontSize: "15px", fontWeight: "700" }}>{a.name}</div>
                <div style={{ fontFamily: sans, fontSize: "12px", color: "#888", marginTop: "4px", lineHeight: 1.4 }}>{a.desc}</div>
              </div>
              <button
                onClick={() => a.id === "audit" ? scrollTo("contact") : window.open(STRIPE_LINKS[a.id], "_blank")}
                style={{
                  padding: "10px 18px", background: a.id === "audit" ? gold : dark,
                  color: a.id === "audit" ? dark : "#fff", border: "none", borderRadius: "6px",
                  fontSize: "13px", fontFamily: sans, fontWeight: "700", cursor: "pointer",
                  flexShrink: 0, marginLeft: "14px",
                }}>
                {a.price === "FREE" ? "Claim" : a.price}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section id="testimonials" style={{ padding: "80px 28px", background: dark, color: "#fff" }}>
        <div style={{ fontSize: "11px", fontFamily: sans, letterSpacing: "3px", textTransform: "uppercase", color: gold, marginBottom: "12px" }}>
          Results
        </div>
        <h2 style={{ fontFamily: font, fontSize: "28px", fontWeight: "600", margin: "0 0 32px", lineHeight: 1.2 }}>
          Don't take our word for it
        </h2>
        {testimonials.map((t, i) => (
          <div key={i} style={{
            padding: "24px", marginBottom: "16px", background: "#151515",
            borderRadius: "10px", borderLeft: `3px solid ${gold}`,
          }}>
            <div style={{ fontFamily: sans, fontSize: "14px", color: "#ccc", lineHeight: 1.7, fontStyle: "italic", marginBottom: "14px" }}>
              "{t.text}"
            </div>
            <div style={{ fontFamily: sans, fontSize: "13px" }}>
              <span style={{ fontWeight: "700", color: "#fff" }}>{t.name}</span>
              <span style={{ color: "#666" }}> · {t.biz}</span>
            </div>
          </div>
        ))}
      </section>

      <section style={{ padding: "80px 28px", background: cream }}>
        <div style={{ fontSize: "11px", fontFamily: sans, letterSpacing: "3px", textTransform: "uppercase", color: gold, marginBottom: "12px" }}>
          FAQ
        </div>
        <h2 style={{ fontFamily: font, fontSize: "28px", fontWeight: "600", margin: "0 0 28px" }}>
          Common questions
        </h2>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            marginBottom: "8px", background: "#fff", borderRadius: "8px",
            border: "1px solid #e0ddd5", overflow: "hidden",
          }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                width: "100%", padding: "18px 20px", display: "flex",
                justifyContent: "space-between", alignItems: "center",
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
              }}
            >
              <span style={{ fontFamily: sans, fontSize: "14px", fontWeight: "600", color: dark, flex: 1, paddingRight: "12px" }}>
                {faq.q}
              </span>
              <span style={{
                color: gold, fontSize: "18px",
                transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0,
              }}>▾</span>
            </button>
            {openFaq === i && (
              <div style={{ padding: "0 20px 18px", fontFamily: sans, fontSize: "14px", color: "#666", lineHeight: 1.7 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </section>

      <section id="contact" style={{ padding: "80px 28px", background: dark, color: "#fff" }}>
        <div style={{ fontSize: "11px", fontFamily: sans, letterSpacing: "3px", textTransform: "uppercase", color: gold, marginBottom: "12px" }}>
          Get Started
        </div>
        <h2 style={{ fontFamily: font, fontSize: "32px", fontWeight: "600", margin: "0 0 8px", lineHeight: 1.15 }}>
          Claim your free business audit
        </h2>
        <p style={{ fontFamily: sans, fontSize: "14px", color: "#888", marginBottom: "28px", lineHeight: 1.6 }}>
          We'll analyze your online presence and show you exactly what's costing you customers — in 15 minutes, no strings attached.
        </p>

        {formSent ? (
          <div style={{
            padding: "32px", background: "#151515", borderRadius: "10px",
            textAlign: "center", border: `1px solid ${gold}40`,
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>✓</div>
            <div style={{ fontFamily: font, fontSize: "22px", marginBottom: "8px" }}>We're on it.</div>
            <div style={{ fontFamily: sans, fontSize: "14px", color: "#888" }}>
              Expect your free audit within 24 hours.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { key: "name", placeholder: "Your name", type: "text" },
              { key: "email", placeholder: "Email address", type: "email" },
              { key: "business", placeholder: "Business name (optional)", type: "text" },
            ].map((field) => (
              <input
                key={field.key}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.key]}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                style={{
                  padding: "16px", background: "#151515", border: "1px solid #333",
                  borderRadius: "6px", color: "#fff", fontSize: "14px", fontFamily: sans,
                  outline: "none",
                }}
              />
            ))}
            <textarea
              placeholder="Tell us about your business and biggest challenge..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              style={{
                padding: "16px", background: "#151515", border: "1px solid #333",
                borderRadius: "6px", color: "#fff", fontSize: "14px", fontFamily: sans,
                outline: "none", resize: "vertical",
              }}
            />
            <button
              onClick={handleSubmit}
              style={{
                padding: "18px", background: gold, color: dark, border: "none",
                borderRadius: "6px", fontSize: "15px", fontFamily: sans, fontWeight: "700",
                cursor: "pointer", letterSpacing: "0.5px", marginTop: "4px",
              }}
            >
              Get My Free Audit →
            </button>
          </div>
        )}
      </section>

      <footer style={{
        padding: "40px 28px", background: "#080808", borentTop: "1px solid #1a1a1a",
        textAlign: "center",
      }}>
        <div style={{ fontFamily: font, fontSize: "20px", fontWeight: "700", color: "#fff", marginBottom: "16px" }}>
          <span style={{ color: gold }}>●</span> APEX
        </div>
        <div style={{ fontFamily: sans, fontSize: "12px", color: "#555", lineHeight: 2 }}>
          AI-Powered Marketing for South Florida Businesses
        </div>
        <div style={{ fontFamily: sans, fontSize: "11px", color: "#333", marginTop: "24px" }}>
          © 2026 Apex Marketing. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

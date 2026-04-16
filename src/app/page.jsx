import { useState, useEffect, useRef } from "react";

/* ─── STRIPE LINKS ─── */
const STRIPE_LINKS = {
  starter: "https://buy.stripe.com/YOUR_STARTER_LINK",
  growth: "https://buy.stripe.com/YOUR_GROWTH_LINK",
  premium: "https://buy.stripe.com/YOUR_PREMIUM_LINK",
  chatbot: "https://buy.stripe.com/YOUR_CHATBOT_LINK",
  leadgen: "https://buy.stripe.com/YOUR_LEADGEN_LINK",
};

/* ─── DATA ─── */
const plans = [
  {
    id: "starter", name: "Starter", price: 500, period: "/mo",
    tagline: "Get found. Get noticed.", best: false,
    features: ["20 social media posts/month", "Custom captions & hashtags", "Monthly content calendar", "Basic analytics report", "1 revision round per batch"],
    cta: "Start Growing",
  },
  {
    id: "growth", name: "Growth", price: 1500, period: "/mo",
    tagline: "The full engine.", best: true,
    features: ["30 social media posts/month", "Email marketing (4 campaigns/mo)", "Automated review requests", "AI chatbot for your website", "Lead nurture email sequences", "Competitive monitoring", "Dedicated strategy calls"],
    cta: "Accelerate Now",
  },
  {
    id: "premium", name: "Premium", price: 3000, period: "/mo",
    tagline: "Done-for-you growth team.", best: false,
    features: ["Everything in Growth, plus:", "Full social media management", "Blog & SEO content (4 posts/mo)", "Paid ad management (FB/IG)", "Custom automation workflows", "A/B testing & optimization", "Quarterly business reviews", "Priority support & Slack access"],
    cta: "Go Premium",
  },
];

const processSteps = [
  { num: "01", title: "Free Audit", desc: "We analyze your online presence, competitors, and missed opportunities — free, in 15 minutes.", icon: "🔍" },
  { num: "02", title: "Custom Strategy", desc: "We build a tailored marketing plan based on your business, goals, and budget.", icon: "📋" },
  { num: "03", title: "Launch & Execute", desc: "Content goes live, automations activate, and leads start flowing within the first week.", icon: "🚀" },
  { num: "04", title: "Optimize & Scale", desc: "Monthly reporting, A/B testing, and strategy calls to continuously improve results.", icon: "📈" },
];

const testimonials = [
  { name: "Dr. Sarah M.", biz: "Med Spa Owner", text: "They built us a review system that got us from 40 to 200+ Google reviews in 3 months. New client inquiries doubled.", rating: 5 },
  { name: "Marcus T.", biz: "Restaurant Owner", text: "Our weeknight covers went up 35% after the first month. The social content looks better than what we were paying a $5K agency for.", rating: 5 },
  { name: "Rebecca S.", biz: "Real Estate Broker", text: "The automated lead nurture alone has closed two extra deals this quarter. That paid for a full year of service.", rating: 5 },
  { name: "James L.", biz: "Dental Practice", text: "We went from 2-3 new patients a week to 8-10. The chatbot books appointments while we sleep. Game changer.", rating: 5 },
  { name: "Angela R.", biz: "Hair Salon Owner", text: "I used to spend 10 hours a week on social media. Now it's zero — and our engagement has actually gone up.", rating: 5 },
];

const faqs = [
  { q: "How fast will I see results?", a: "Most clients see measurable increases in engagement and leads within 30 days. Significant revenue impact typically shows within 60-90 days." },
  { q: "What's the contract length?", a: "Month-to-month. No long-term contracts. We earn your business every single month. Most clients stay because the ROI speaks for itself." },
  { q: "Do I need to provide photos/videos?", a: "It helps, but it's not required. We can work with stock imagery, create branded graphics, and guide you on simple phone photos that perform well." },
  { q: "How is this different from a marketing agency?", a: "Traditional agencies charge $3,000-$10,000/month and move slowly. We use AI-powered workflows to deliver the same (or better) quality at a fraction of the cost and 3x the speed." },
  { q: "Can I switch plans?", a: "Absolutely. Upgrade or downgrade anytime. Most clients start with Starter and move to Growth within 60 days once they see the results." },
  { q: "What if I'm not happy?", a: "Cancel anytime with zero fees. But in 12 months, we've had a 94% client retention rate — because the numbers speak for themselves." },
];

const comparisonData = [
  { feature: "Monthly cost", them: "$3,000–$10,000", us: "$500–$3,000" },
  { feature: "Content turnaround", them: "1–2 weeks", us: "24–48 hours" },
  { feature: "Contract length", them: "6–12 months", us: "Month-to-month" },
  { feature: "Dedicated strategist", them: "Only premium tiers", us: "Every plan" },
  { feature: "AI-powered tools", them: "Rarely", us: "Core to everything" },
  { feature: "Automation included", them: "Extra cost", us: "Built-in" },
  { feature: "Response time", them: "24–72 hours", us: "Same day" },
];

/* ─── HOOKS ─── */
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCounter(target, visible, duration = 2000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [visible, target, duration]);
  return val;
}

/* ─── COMPONENTS ─── */
function AnimatedSection({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView(0.15);
  return (
    <div ref={ref} style={{
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(40px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function ROICalculator() {
  const [bill, setBill] = useState(1500);
  const [avgTicket, setAvgTicket] = useState(150);
  const [plan, setPlan] = useState(1500);

  const newCustomers = Math.round((plan * 4.2) / avgTicket);
  const monthlyRevenue = newCustomers * avgTicket;
  const roi = Math.round(((monthlyRevenue - plan) / plan) * 100);
  const yearlyProfit = (monthlyRevenue - plan) * 12;

  const font = "'Playfair Display', Georgia, serif";
  const sans = "'DM Sans', 'Helvetica Neue', sans-serif";
  const gold = "#c8a44e";

  return (
    <div style={{ padding: "28px", background: "#151515", borderRadius: "12px", border: "1px solid #222" }}>
      <div style={{ marginBottom: "24px" }}>
        <label style={{ fontFamily: sans, fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
          Your monthly marketing budget
        </label>
        <div style={{ display: "flex", gap: "8px" }}>
          {[500, 1500, 3000].map((p) => (
            <button key={p} onClick={() => setPlan(p)} style={{
              flex: 1, padding: "12px", borderRadius: "6px", border: plan === p ? `2px solid ${gold}` : "1px solid #333",
              background: plan === p ? `${gold}15` : "#0c0c0c", color: plan === p ? gold : "#888",
              fontFamily: sans, fontSize: "14px", fontWeight: "700", cursor: "pointer",
            }}>
              ${p.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={{ fontFamily: sans, fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
          Average customer value: <span style={{ color: gold, fontWeight: "700" }}>${avgTicket}</span>
        </label>
        <input type="range" min={25} max={500} step={25} value={avgTicket} onChange={(e) => setAvgTicket(+e.target.value)}
          style={{ width: "100%", accentColor: gold, height: "6px", cursor: "pointer" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: sans, fontSize: "11px", color: "#555", marginTop: "4px" }}>
          <span>$25</span><span>$500</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "20px" }}>
        {[
          { label: "Est. new customers/mo", value: newCustomers, suffix: "" },
          { label: "Monthly revenue added", value: `$${monthlyRevenue.toLocaleString()}`, suffix: "" },
          { label: "Return on investment", value: `${roi}%`, suffix: "" },
          { label: "Annual profit impact", value: `$${yearlyProfit.toLocaleString()}`, suffix: "" },
        ].map((item, i) => (
          <div key={i} style={{ padding: "16px", background: "#0c0c0c", borderRadius: "8px", border: "1px solid #1e1e1e" }}>
            <div style={{ fontFamily: font, fontSize: "24px", fontWeight: "700", color: gold }}>{item.value}</div>
            <div style={{ fontFamily: sans, fontSize: "11px", color: "#666", marginTop: "4px", lineHeight: 1.3 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const font = "'Playfair Display', Georgia, serif";
  const sans = "'DM Sans', 'Helvetica Neue', sans-serif";
  const gold = "#c8a44e";

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setActive((a) => (a + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ position: "relative", minHeight: "200px" }}>
        {testimonials.map((t, i) => (
          <div key={i} style={{
            position: i === active ? "relative" : "absolute", top: 0, left: 0, right: 0,
            opacity: i === active ? 1 : 0, transform: i === active ? "translateX(0)" : "translateX(30px)",
            transition: "all 0.5s ease", pointerEvents: i === active ? "auto" : "none",
            padding: "28px", background: "#151515", borderRadius: "12px", borderLeft: `3px solid ${gold}`,
          }}>
            <div style={{ marginBottom: "12px" }}>
              {[...Array(t.rating)].map((_, s) => <span key={s} style={{ color: gold, fontSize: "16px" }}>★</span>)}
            </div>
            <div style={{ fontFamily: sans, fontSize: "15px", color: "#ccc", lineHeight: 1.7, fontStyle: "italic", marginBottom: "16px" }}>
              &ldquo;{t.text}&rdquo;
            </div>
            <div style={{ fontFamily: sans, fontSize: "14px" }}>
              <span style={{ fontWeight: "700", color: "#fff" }}>{t.name}</span>
              <span style={{ color: "#666" }}> · {t.biz}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
        {testimonials.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            width: i === active ? "28px" : "8px", height: "8px", borderRadius: "4px",
            background: i === active ? gold : "#333", border: "none", cursor: "pointer",
            transition: "all 0.3s ease", padding: 0,
          }} />
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
export default function AgencyWebsite() {
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", business: "", phone: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const [billing, setBilling] = useState("monthly");
  const [activeStep, setActiveStep] = useState(0);

  const [statsRef, statsVisible] = useInView(0.3);
  const counter1 = useCounter(312, statsVisible);
  const counter2 = useCounter(47, statsVisible, 1500);
  const counter3 = useCounter(94, statsVisible, 1800);
  const counter4 = useCounter(90, statsVisible, 1200);

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

  const yearlyDiscount = 0.85;

  return (
    <div style={{ background: cream, color: dark, overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* ─── NAV ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(12,12,12,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none", transition: "all 0.4s ease",
        padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ fontFamily: font, fontSize: "20px", fontWeight: "700", color: "#fff", letterSpacing: "-0.5px" }}>
          <span style={{ color: gold }}>●</span> APEX
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => scrollTo("contact")} style={{
            padding: "8px 16px", background: gold, color: dark, border: "none", borderRadius: "5px",
            fontSize: "12px", fontFamily: sans, fontWeight: "700", cursor: "pointer", display: scrolled ? "block" : "none",
          }}>
            Free Audit
          </button>
          <button onClick={() => setMobileMenu(!mobileMenu)} style={{
            background: "none", border: "none", color: "#fff", fontSize: "24px", cursor: "pointer", padding: "4px",
          }}>
            {mobileMenu ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {mobileMenu && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99,
          background: "rgba(12,12,12,0.98)", display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", gap: "28px",
        }}>
          {[
            { label: "Services", id: "services" }, { label: "How It Works", id: "process" },
            { label: "Results", id: "results" }, { label: "Pricing", id: "pricing" },
            { label: "ROI Calculator", id: "calculator" }, { label: "Reviews", id: "testimonials" },
            { label: "Contact", id: "contact" },
          ].map((s) => (
            <button key={s.id} onClick={() => scrollTo(s.id)} style={{
              background: "none", border: "none", color: "#fff", fontSize: "24px",
              fontFamily: font, cursor: "pointer", letterSpacing: "0.5px",
            }}>{s.label}</button>
          ))}
        </div>
      )}

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "120px 28px 60px", background: dark, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-20%", right: "-30%", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, ${gold}18, transparent 65%)` }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "-15%", width: "400px", height: "400px", borderRadius: "50%", background: `radial-gradient(circle, ${gold}0a, transparent 65%)` }} />
        <div style={{ position: "absolute", top: "20%", left: "10%", width: "2px", height: "80px", background: `linear-gradient(to bottom, ${gold}40, transparent)`, transform: "rotate(20deg)" }} />
        <div style={{ position: "absolute", top: "60%", right: "15%", width: "2px", height: "60px", background: `linear-gradient(to bottom, ${gold}30, transparent)`, transform: "rotate(-15deg)" }} />

        <AnimatedSection style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-block", padding: "6px 14px", border: `1px solid ${gold}40`, borderRadius: "20px",
            fontSize: "11px", fontFamily: sans, color: gold, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "24px",
          }}>
            AI-Powered Marketing
          </div>
          <h1 style={{
            fontFamily: font, fontSize: "clamp(38px, 8vw, 58px)", fontWeight: "700",
            lineHeight: 1.06, color: "#fff", margin: "0 0 20px", letterSpacing: "-1px",
          }}>
            We fill your<br />calendar.<br /><span style={{ color: gold }}>You run your<br />business.</span>
          </h1>
          <p style={{ fontFamily: sans, fontSize: "16px", lineHeight: 1.6, color: "#999", maxWidth: "440px", margin: "0 0 36px" }}>
            AI-powered content, automation, and lead generation for South Florida businesses. More customers, less effort, starting at $500/month.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("pricing")} style={{
              padding: "16px 32px", background: gold, color: dark, border: "none", borderRadius: "6px",
              fontSize: "14px", fontFamily: sans, fontWeight: "700", cursor: "pointer",
              transition: "transform 0.2s ease", position: "relative",
            }}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.97)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              See Pricing
            </button>
            <button onClick={() => scrollTo("contact")} style={{
              padding: "16px 32px", background: "transparent", color: "#fff",
              border: "1px solid #333", borderRadius: "6px", fontSize: "14px",
              fontFamily: sans, fontWeight: "600", cursor: "pointer", transition: "border-color 0.2s ease",
            }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = gold}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "#333"}
            >
              Free Audit →
            </button>
          </div>
        </AnimatedSection>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
          <div style={{
            width: "20px", height: "32px", border: "2px solid #333", borderRadius: "10px",
            margin: "0 auto 8px", position: "relative",
          }}>
            <div style={{
              width: "3px", height: "8px", background: gold, borderRadius: "2px",
              position: "absolute", top: "6px", left: "50%", transform: "translateX(-50%)",
              animation: "scrollBounce 2s ease infinite",
            }} />
          </div>
          <style>{`@keyframes scrollBounce { 0%,100% { opacity:1; transform: translateX(-50%) translateY(0); } 50% { opacity:0.3; transform: translateX(-50%) translateY(10px); } }`}</style>
        </div>
      </section>

      {/* ─── ANIMATED STATS ─── */}
      <section ref={statsRef} style={{ background: "#111", padding: "48px 28px", borderTop: `1px solid ${gold}20` }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {[
            { val: counter1, suffix: "%", label: "Increase in online leads" },
            { val: counter2, suffix: "+", label: "Businesses scaled in South FL" },
            { val: counter3, suffix: "%", label: "Client retention rate" },
            { val: `< ${counter4}`, suffix: "", label: "Days to measurable results" },
          ].map((r, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: font, fontSize: "36px", fontWeight: "700", color: gold }}>
                {typeof r.val === "number" ? r.val : r.val}{r.suffix}
              </div>
              <div style={{ fontFamily: sans, fontSize: "12px", color: "#666", marginTop: "4px", lineHeight: 1.4 }}>{r.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" style={{ padding: "80px 28px", background: cream }}>
        <AnimatedSection>
          <div style={{ fontSize: "11px", fontFamily: sans, letterSpacing: "3px", textTransform: "uppercase", color: gold, marginBottom: "12px" }}>What We Do</div>
          <h2 style={{ fontFamily: font, fontSize: "32px", fontWeight: "600", margin: "0 0 40px", lineHeight: 1.15 }}>
            Everything your business needs to grow online
          </h2>
        </AnimatedSection>
        {[
          { icon: "◆", title: "Content Creation", desc: "Social media posts, blog articles, email campaigns, and ad copy — all written, designed, and scheduled. 30 days of content in 48 hours.", tag: "Most Popular" },
          { icon: "▲", title: "Marketing Automation", desc: "Automated review requests, lead follow-ups, appointment reminders, and email sequences that work while you sleep." },
          { icon: "●", title: "AI Chatbots", desc: "A custom AI assistant on your website that answers questions, captures leads, and books appointments 24/7." },
          { icon: "■", title: "Lead Generation", desc: "Full-funnel lead capture: landing pages, paid ads, email nurture sequences, and CRM setup." },
        ].map((s, i) => (
          <AnimatedSection key={i} delay={i * 0.1}>
            <div style={{
              display: "flex", gap: "16px", marginBottom: "16px", padding: "22px",
              background: "#fff", borderRadius: "10px", border: "1px solid #e8e5de",
              cursor: "default", transition: "all 0.25s ease", position: "relative", overflow: "hidden",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.borderColor = gold; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.borderColor = "#e8e5de"; }}
            >
              <div style={{ fontSize: "22px", color: gold, flexShrink: 0, marginTop: "2px" }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontFamily: sans, fontSize: "16px", fontWeight: "700" }}>{s.title}</span>
                  {s.tag && <span style={{ fontSize: "9px", fontFamily: sans, fontWeight: "700", color: gold, background: `${gold}15`, padding: "3px 8px", borderRadius: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>{s.tag}</span>}
                </div>
                <div style={{ fontFamily: sans, fontSize: "14px", color: "#666", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </section>

      {/* ─── PROCESS TIMELINE ─── */}
      <section id="process" style={{ padding: "80px 28px", background: dark, color: "#fff" }}>
        <AnimatedSection>
          <div style={{ fontSize: "11px", fontFamily: sans, letterSpacing: "3px", textTransform: "uppercase", color: gold, marginBottom: "12px" }}>How It Works</div>
          <h2 style={{ fontFamily: font, fontSize: "28px", fontWeight: "600", margin: "0 0 36px", lineHeight: 1.2 }}>From zero to results in 4 steps</h2>
        </AnimatedSection>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "19px", top: "0", bottom: "0", width: "2px", background: "#222" }} />
          {processSteps.map((step, i) => (
            <AnimatedSection key={i} delay={i * 0.15}>
              <div
                onClick={() => setActiveStep(i)}
                style={{
                  display: "flex", gap: "20px", marginBottom: "8px", padding: "20px 20px 20px 0",
                  cursor: "pointer", position: "relative",
                }}
              >
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                  background: activeStep === i ? gold : "#1a1a1a",
                  border: activeStep === i ? "none" : "2px solid #333",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontFamily: sans, fontWeight: "700",
                  color: activeStep === i ? dark : "#666", transition: "all 0.3s ease", zIndex: 1,
                }}>
                  {step.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: sans, fontSize: "16px", fontWeight: "700", marginBottom: "6px", color: activeStep === i ? "#fff" : "#888", transition: "color 0.3s ease" }}>
                    {step.icon} {step.title}
                  </div>
                  <div style={{
                    fontFamily: sans, fontSize: "13px", color: "#666", lineHeight: 1.6,
                    maxHeight: activeStep === i ? "100px" : "0", overflow: "hidden",
                    opacity: activeStep === i ? 1 : 0, transition: "all 0.4s ease",
                  }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ─── COMPARISON TABLE ─── */}
      <section id="results" style={{ padding: "80px 28px", background: cream }}>
        <AnimatedSection>
          <div style={{ fontSize: "11px", fontFamily: sans, letterSpacing: "3px", textTransform: "uppercase", color: gold, marginBottom: "12px" }}>Why Us</div>
          <h2 style={{ fontFamily: font, fontSize: "28px", fontWeight: "600", margin: "0 0 32px", lineHeight: 1.2 }}>
            APEX vs. Traditional Agencies
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e0ddd5" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: dark, padding: "14px 12px" }}>
              <div style={{ fontFamily: sans, fontSize: "11px", color: "#666", textTransform: "uppercase", letterSpacing: "1px" }}>Feature</div>
              <div style={{ fontFamily: sans, fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center" }}>Them</div>
              <div style={{ fontFamily: sans, fontSize: "11px", color: gold, textTransform: "uppercase", letterSpacing: "1px", textAlign: "center", fontWeight: "700" }}>APEX</div>
            </div>
            {comparisonData.map((row, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 12px",
                background: i % 2 === 0 ? "#fff" : "#faf8f4", borderTop: "1px solid #eee",
              }}>
                <div style={{ fontFamily: sans, fontSize: "12px", color: "#444", fontWeight: "600" }}>{row.feature}</div>
                <div style={{ fontFamily: sans, fontSize: "12px", color: "#999", textAlign: "center" }}>{row.them}</div>
                <div style={{ fontFamily: sans, fontSize: "12px", color: dark, textAlign: "center", fontWeight: "700" }}>{row.us}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" style={{ padding: "80px 28px", background: dark, color: "#fff" }}>
        <AnimatedSection>
          <div style={{ fontSize: "11px", fontFamily: sans, letterSpacing: "3px", textTransform: "uppercase", color: gold, marginBottom: "12px" }}>Pricing</div>
          <h2 style={{ fontFamily: font, fontSize: "32px", fontWeight: "600", margin: "0 0 8px", lineHeight: 1.15, color: "#fff" }}>
            Simple. Transparent. No contracts.
          </h2>
          <p style={{ fontFamily: sans, fontSize: "14px", color: "#666", marginBottom: "24px" }}>Cancel anytime. We earn your business every month.</p>
        </AnimatedSection>

        {/* Billing toggle */}
        <AnimatedSection delay={0.1}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
            <span style={{ fontFamily: sans, fontSize: "13px", color: billing === "monthly" ? "#fff" : "#666" }}>Monthly</span>
            <button
              onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
              style={{
                width: "52px", height: "28px", borderRadius: "14px", border: "none", cursor: "pointer",
                background: billing === "yearly" ? gold : "#333", position: "relative", transition: "background 0.3s ease",
              }}
            >
              <div style={{
                width: "22px", height: "22px", borderRadius: "50%", background: "#fff",
                position: "absolute", top: "3px",
                left: billing === "yearly" ? "27px" : "3px", transition: "left 0.3s ease",
              }} />
            </button>
            <span style={{ fontFamily: sans, fontSize: "13px", color: billing === "yearly" ? "#fff" : "#666" }}>
              Yearly <span style={{ color: gold, fontWeight: "700", fontSize: "11px" }}>SAVE 15%</span>
            </span>
          </div>
        </AnimatedSection>

        {plans.map((plan, idx) => (
          <AnimatedSection key={plan.id} delay={idx * 0.1 + 0.2}>
            <div style={{
              marginBottom: "20px", borderRadius: "12px", overflow: "hidden",
              border: plan.best ? `2px solid ${gold}` : "1px solid #222",
              background: plan.best ? "#1a1a1a" : "#111", position: "relative",
            }}>
              {plan.best && (
                <div style={{
                  background: gold, color: dark, textAlign: "center", padding: "6px",
                  fontSize: "11px", fontFamily: sans, fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase",
                }}>Most Popular</div>
              )}
              <div style={{ padding: "24px" }}>
                <div style={{ fontFamily: sans, fontSize: "13px", color: "#666", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", margin: "8px 0" }}>
                  <span style={{ fontFamily: font, fontSize: "44px", fontWeight: "700", color: "#fff" }}>
                    ${billing === "yearly" ? Math.round(plan.price * yearlyDiscount).toLocaleString() : plan.price.toLocaleString()}
                  </span>
                  <span style={{ fontFamily: sans, fontSize: "16px", color: "#666" }}>{plan.period}</span>
                </div>
                {billing === "yearly" && (
                  <div style={{ fontFamily: sans, fontSize: "12px", color: gold, marginBottom: "4px" }}>
                    Save ${Math.round(plan.price * 12 * (1 - yearlyDiscount)).toLocaleString()}/year
                  </div>
                )}
                <div style={{ fontFamily: sans, fontSize: "14px", color: "#888", marginBottom: "20px" }}>{plan.tagline}</div>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px", fontFamily: sans, fontSize: "13px", color: "#aaa", lineHeight: 1.5 }}>
                    <span style={{ color: gold, fontWeight: "700", flexShrink: 0 }}>✓</span><span>{f}</span>
                  </div>
                ))}
                <button onClick={() => window.open(STRIPE_LINKS[plan.id], "_blank")} style={{
                  width: "100%", marginTop: "20px", padding: "16px",
                  background: plan.best ? gold : "#fff", color: dark,
                  border: "none", borderRadius: "6px", fontSize: "14px",
                  fontFamily: sans, fontWeight: "700", cursor: "pointer",
                  transition: "transform 0.15s ease",
                }}
                  onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
                  onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                >{plan.cta}</button>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </section>

      {/* ─── ROI CALCULATOR ─── */}
      <section id="calculator" style={{ padding: "80px 28px", background: cream }}>
        <AnimatedSection>
          <div style={{ fontSize: "11px", fontFamily: sans, letterSpacing: "3px", textTransform: "uppercase", color: gold, marginBottom: "12px" }}>ROI Calculator</div>
          <h2 style={{ fontFamily: font, fontSize: "28px", fontWeight: "600", margin: "0 0 8px", lineHeight: 1.2 }}>See what APEX can do for your bottom line</h2>
          <p style={{ fontFamily: sans, fontSize: "14px", color: "#888", marginBottom: "28px" }}>Adjust the sliders to match your business.</p>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <ROICalculator />
        </AnimatedSection>
      </section>

      {/* ─── TESTIMONIALS CAROUSEL ─── */}
      <section id="testimonials" style={{ padding: "80px 28px", background: dark, color: "#fff" }}>
        <AnimatedSection>
          <div style={{ fontSize: "11px", fontFamily: sans, letterSpacing: "3px", textTransform: "uppercase", color: gold, marginBottom: "12px" }}>Reviews</div>
          <h2 style={{ fontFamily: font, fontSize: "28px", fontWeight: "600", margin: "0 0 32px", lineHeight: 1.2 }}>What our clients say</h2>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <TestimonialCarousel />
        </AnimatedSection>
      </section>

      {/* ─── INDUSTRIES ─── */}
      <section style={{ padding: "60px 28px", background: cream }}>
        <AnimatedSection>
          <div style={{ fontSize: "11px", fontFamily: sans, letterSpacing: "3px", textTransform: "uppercase", color: gold, marginBottom: "12px" }}>Built For</div>
          <h2 style={{ fontFamily: font, fontSize: "24px", fontWeight: "600", margin: "0 0 24px" }}>Industries we specialize in</h2>
        </AnimatedSection>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {["Med Spas", "Restaurants", "Real Estate", "Dental Offices", "Hair Salons", "Fitness Studios", "Law Firms", "Contractors"].map((b, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <div style={{
                padding: "16px", background: "#fff", borderRadius: "8px", border: "1px solid #e8e5de",
                fontFamily: sans, fontSize: "13px", color: dark, textAlign: "center", fontWeight: "600",
                cursor: "default", transition: "all 0.2s ease",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = dark; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = dark; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = dark; e.currentTarget.style.borderColor = "#e8e5de"; }}
              >{b}</div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section style={{ padding: "80px 28px", background: dark, color: "#fff" }}>
        <AnimatedSection>
          <div style={{ fontSize: "11px", fontFamily: sans, letterSpacing: "3px", textTransform: "uppercase", color: gold, marginBottom: "12px" }}>FAQ</div>
          <h2 style={{ fontFamily: font, fontSize: "28px", fontWeight: "600", margin: "0 0 28px" }}>Common questions</h2>
        </AnimatedSection>
        {faqs.map((faq, i) => (
          <AnimatedSection key={i} delay={i * 0.05}>
            <div style={{ marginBottom: "8px", background: "#151515", borderRadius: "8px", border: "1px solid #222", overflow: "hidden" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: "100%", padding: "18px 20px", display: "flex",
                justifyContent: "space-between", alignItems: "center",
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
              }}>
                <span style={{ fontFamily: sans, fontSize: "14px", fontWeight: "600", color: "#ddd", flex: 1, paddingRight: "12px" }}>{faq.q}</span>
                <span style={{
                  color: gold, fontSize: "20px", transition: "transform 0.3s ease",
                  transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)", flexShrink: 0,
                }}>+</span>
              </button>
              <div style={{
                maxHeight: openFaq === i ? "200px" : "0", overflow: "hidden",
                transition: "max-height 0.4s ease", padding: openFaq === i ? "0 20px 18px" : "0 20px",
              }}>
                <div style={{ fontFamily: sans, fontSize: "14px", color: "#888", lineHeight: 1.7 }}>{faq.a}</div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" style={{ padding: "80px 28px", background: cream }}>
        <AnimatedSection>
          <div style={{ fontSize: "11px", fontFamily: sans, letterSpacing: "3px", textTransform: "uppercase", color: gold, marginBottom: "12px" }}>Get Started</div>
          <h2 style={{ fontFamily: font, fontSize: "32px", fontWeight: "600", margin: "0 0 8px", lineHeight: 1.15 }}>Claim your free business audit</h2>
          <p style={{ fontFamily: sans, fontSize: "14px", color: "#888", marginBottom: "28px", lineHeight: 1.6 }}>
            We'll analyze your online presence and show you exactly what's costing you customers — 15 minutes, no strings.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          {formSent ? (
            <div style={{
              padding: "40px", background: "#fff", borderRadius: "12px", textAlign: "center",
              border: `2px solid ${gold}`,
            }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: `${gold}20`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "28px" }}>✓</div>
              <div style={{ fontFamily: font, fontSize: "24px", marginBottom: "8px" }}>We're on it.</div>
              <div style={{ fontFamily: sans, fontSize: "14px", color: "#888" }}>Expect your free audit within 24 hours.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <input type="text" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ padding: "16px", background: "#fff", border: "1px solid #ddd", borderRadius: "6px", color: dark, fontSize: "14px", fontFamily: sans, outline: "none" }} />
                <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ padding: "16px", background: "#fff", border: "1px solid #ddd", borderRadius: "6px", color: dark, fontSize: "14px", fontFamily: sans, outline: "none" }} />
              </div>
              <input type="email" placeholder="Email address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ padding: "16px", background: "#fff", border: "1px solid #ddd", borderRadius: "6px", color: dark, fontSize: "14px", fontFamily: sans, outline: "none" }} />
              <input type="text" placeholder="Business name" value={formData.business} onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                style={{ padding: "16px", background: "#fff", border: "1px solid #ddd", borderRadius: "6px", color: dark, fontSize: "14px", fontFamily: sans, outline: "none" }} />
              <textarea placeholder="What's your biggest marketing challenge right now?" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={3}
                style={{ padding: "16px", background: "#fff", border: "1px solid #ddd", borderRadius: "6px", color: dark, fontSize: "14px", fontFamily: sans, outline: "none", resize: "vertical" }} />
              <button onClick={handleSubmit} style={{
                padding: "18px", background: dark, color: "#fff", border: "none", borderRadius: "6px",
                fontSize: "15px", fontFamily: sans, fontWeight: "700", cursor: "pointer", marginTop: "4px",
                transition: "background 0.2s ease",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = gold}
                onMouseLeave={(e) => e.currentTarget.style.background = dark}
              >
                Get My Free Audit →
              </button>
              <div style={{ fontFamily: sans, fontSize: "11px", color: "#bbb", textAlign: "center", marginTop: "4px" }}>
                No spam. No obligation. Just value.
              </div>
            </div>
          )}
        </AnimatedSection>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ padding: "40px 28px", background: dark, borderTop: `1px solid #1a1a1a`, textAlign: "center" }}>
        <div style={{ fontFamily: font, fontSize: "20px", fontWeight: "700", color: "#fff", marginBottom: "16px" }}>
          <span style={{ color: gold }}>●</span> APEX
        </div>
        <div style={{ fontFamily: sans, fontSize: "12px", color: "#555", lineHeight: 2 }}>AI-Powered Marketing for South Florida Businesses</div>
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "16px" }}>
          {["services", "pricing", "calculator", "contact"].map((s) => (
            <button key={s} onClick={() => scrollTo(s)} style={{
              background: "none", border: "none", color: "#555", fontSize: "12px",
              fontFamily: sans, cursor: "pointer", textTransform: "capitalize",
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = gold}
              onMouseLeave={(e) => e.currentTarget.style.color = "#555"}
            >{s}</button>
          ))}
        </div>
        <div style={{ fontFamily: sans, fontSize: "11px", color: "#333", marginTop: "24px" }}>© 2026 Apex Marketing. All rights reserved.</div>
      </footer>
    </div>
  );
}

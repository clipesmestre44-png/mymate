"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  TrendingUp,
  Shield,
  Globe,
  ArrowRight,
  CheckCircle2,
  Wallet,
  PieChart,
  Calculator,
  BookOpen,
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "All Your Accounts",
    description: "AUD, USD, BRL — see every account and currency in one clean view.",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: PieChart,
    title: "Smart Categories",
    description: "Auto-categorise every transaction. Know exactly where your money goes.",
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    icon: BookOpen,
    title: "Spending Guide",
    description: "Personalised tips on how to budget smarter and save more each month.",
    color: "#06B6D4",
    bg: "#ECFEFF",
  },
  {
    icon: Calculator,
    title: "Investment Calculator",
    description: "See how your money grows with ETFs, super, or savings accounts.",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    icon: Globe,
    title: "Built for Immigrants",
    description: "Track remittances, FX rates, and manage money across borders.",
    color: "#F43F5E",
    bg: "#FFF1F2",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "CDR-compliant open banking. We never see your bank credentials.",
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
];

const stats = [
  { value: "12K+", label: "Active users" },
  { value: "$2.4M", label: "Tracked monthly" },
  { value: "4.9★", label: "User rating" },
];

export default function LandingPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", background: "#F8FAFC" }}>
      {/* Nav */}
      <nav
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E2E8F0",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUp size={20} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 20, color: "#0F172A" }}>MyMate</span>
          </div>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              background: loading ? "#A78BFA" : "#7C3AED",
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "10px 20px",
              fontWeight: 600,
              fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Get Started <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 24px 60px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#EDE9FE",
            color: "#7C3AED",
            borderRadius: 100,
            padding: "6px 16px",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 28,
          }}
        >
          <span>🇦🇺</span> Built for Australia & New Arrivals
        </div>

        <h1
          style={{
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#0F172A",
            marginBottom: 24,
            letterSpacing: "-1.5px",
          }}
        >
          Your money.{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Finally sorted.
          </span>
        </h1>

        <p
          style={{
            fontSize: 20,
            color: "#64748B",
            maxWidth: 560,
            margin: "0 auto 40px",
            lineHeight: 1.6,
          }}
        >
          Track spending, manage multiple accounts, grow your savings — all in one app designed for modern Australia.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              background: loading ? "#A78BFA" : "linear-gradient(135deg, #7C3AED, #6D28D9)",
              color: "white",
              border: "none",
              borderRadius: 14,
              padding: "16px 32px",
              fontWeight: 700,
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 8px 24px rgba(124,58,237,0.35)",
            }}
          >
            {loading ? (
              "Redirecting..."
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 20 }}>
          <CheckCircle2 size={16} color="#10B981" />
          <span style={{ color: "#64748B", fontSize: 13 }}>No credit card required · Free to start</span>
        </div>
      </section>

      {/* Stats Banner */}
      <section style={{ background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)", padding: "48px 24px" }}>
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
            textAlign: "center",
          }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 36, fontWeight: 800, color: "white", letterSpacing: "-1px" }}>{s.value}</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2
            style={{ fontSize: 36, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px", marginBottom: 16 }}
          >
            Everything your wallet needs
          </h2>
          <p style={{ color: "#64748B", fontSize: 18, maxWidth: 480, margin: "0 auto" }}>
            One app to replace the spreadsheets, sticky notes, and late-night money stress.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: "white",
                borderRadius: 20,
                padding: 28,
                border: "1px solid #F1F5F9",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: f.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <f.icon size={24} color={f.color} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: "#0F172A", marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.6 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0F172A", padding: "80px 24px", textAlign: "center" }}>
        <h2
          style={{ fontSize: 36, fontWeight: 800, color: "white", letterSpacing: "-0.5px", marginBottom: 16 }}
        >
          Ready to get your finances sorted?
        </h2>
        <p style={{ color: "#94A3B8", fontSize: 18, marginBottom: 36 }}>
          Join thousands of Australians and newcomers taking control.
        </p>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            color: "white",
            border: "none",
            borderRadius: 14,
            padding: "18px 40px",
            fontWeight: 700,
            fontSize: 17,
            cursor: loading ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
          }}
        >
          Start for free <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0F172A", borderTop: "1px solid #1E293B", padding: "24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={14} color="white" />
          </div>
          <span style={{ fontWeight: 700, color: "white", fontSize: 16 }}>MyMate</span>
        </div>
        <p style={{ color: "#475569", fontSize: 13 }}>
          © 2026 MyMate · ABN 00 000 000 000 · Built with ❤️ for Australia
        </p>
      </footer>
    </div>
  );
}

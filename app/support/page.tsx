import { LogoMark } from "@/app/components/LogoMark";

export const metadata = {
  title: "Support — MyMate",
  description: "Get help with MyMate. Contact us or find answers to common questions.",
};

const faqs = [
  {
    q: "How do I add a new account?",
    a: "Go to the Accounts tab and tap the + button in the top right corner. You can add any account manually — bank accounts, wallets, or investment accounts in any currency.",
  },
  {
    q: "Can MyMate connect directly to my bank?",
    a: "Not at this stage. All account balances and transactions are entered manually. This means your bank credentials are never shared with us.",
  },
  {
    q: "How do I delete a transaction?",
    a: "Open the Accounts tab, tap on an account to view its history, then tap the transaction you want to remove. A delete option will appear in the modal.",
  },
  {
    q: "How are spending categories assigned?",
    a: "Categories are assigned automatically based on the transaction description you enter. You can change the category at any time by editing the transaction.",
  },
  {
    q: "How do I enable weekly or monthly reports?",
    a: "Go to Settings and scroll to the Reports section. Toggle on Weekly Report or Monthly Report. You can also preview each report before enabling it.",
  },
  {
    q: "How do I change my currency?",
    a: "Go to Settings → Preferences and select your preferred display currency. MyMate supports AUD, USD, BRL, EUR, and more.",
  },
  {
    q: "How do I delete my account and data?",
    a: "Email us at nex.labau@gmail.com with the subject 'Delete my account' from your registered email address. We will permanently delete all your data within 5 business days.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. Your data is encrypted at rest and in transit. We use row-level security so only you can access your own data. We never sell your data to third parties.",
  },
];

export default function SupportPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Nav */}
      <nav style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <LogoMark size={28} color="#7C3AED" />
            <span style={{ fontWeight: 700, fontSize: 17, color: "#0F172A" }}>MyMate</span>
          </a>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>Support</span>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "56px 24px 96px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, background: "#EDE9FE", borderRadius: 16, marginBottom: 20 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.5px", color: "#0F172A", marginBottom: 14, lineHeight: 1.15 }}>How can we help?</h1>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.65, maxWidth: 500, margin: "0 auto" }}>
            Find answers to common questions below, or get in touch with our team directly.
          </p>
        </div>

        {/* Contact card */}
        <div style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)", borderRadius: 20, padding: "32px 36px", marginBottom: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: 8 }}>Contact support</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "white", marginBottom: 8 }}>Still need help?</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
              Email us and we'll get back to you within 1–2 business days.
            </p>
          </div>
          <a
            href="mailto:nex.labau@gmail.com?subject=MyMate Support"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "white", color: "#7C3AED", fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 12, textDecoration: "none", whiteSpace: "nowrap" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            nex.labau@gmail.com
          </a>
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 24 }}>Frequently asked questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 24px" }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 8, lineHeight: 1.4 }}>{faq.q}</p>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Response time banner */}
        <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderLeft: "3px solid #10B981", borderRadius: "0 12px 12px 0", padding: "16px 20px", marginTop: 40 }}>
          <p style={{ fontSize: 14, color: "#065F46", margin: 0, lineHeight: 1.6 }}>
            <strong>Response time:</strong> We typically respond to support emails within 1–2 business days. For account deletion requests, please allow up to 5 business days.
          </p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LogoMark size={18} color="#7C3AED" />
            <span style={{ fontSize: 12, color: "#94A3B8" }}>© 2026 MyMate</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="/privacy" style={{ fontSize: 12, color: "#94A3B8", textDecoration: "none" }}>Privacy Policy</a>
            <a href="mailto:nex.labau@gmail.com" style={{ fontSize: 12, color: "#7C3AED", textDecoration: "none" }}>nex.labau@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}

import { LogoMark } from "@/app/components/LogoMark";

export const metadata = {
  title: "Privacy Policy — MyMate",
  description: "How MyMate collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Nav */}
      <nav style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <LogoMark size={28} color="#7C3AED" />
            <span style={{ fontWeight: 700, fontSize: 17, color: "#0F172A" }}>MyMate</span>
          </a>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>Privacy Policy · 14 July 2026</span>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "56px 24px 96px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48, paddingBottom: 40, borderBottom: "1px solid #E2E8F0" }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7C3AED", marginBottom: 12 }}>Legal</p>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.5px", color: "#0F172A", marginBottom: 16, lineHeight: 1.15 }}>Privacy Policy</h1>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.65, maxWidth: 600, marginBottom: 20 }}>
            MyMate is built on trust. This policy explains clearly what personal information we collect, why we collect it, and how we protect it.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {[["Effective", "14 July 2026"], ["Jurisdiction", "Australia"], ["Governed by", "Privacy Act 1988 (Cth)"]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 13, color: "#475569" }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Notice box */}
        <div style={{ background: "#EDE9FE", border: "1px solid #DDD6FE", borderLeft: "3px solid #7C3AED", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: 48 }}>
          <p style={{ fontSize: 14, color: "#5B21B6", lineHeight: 1.6, margin: 0 }}>
            <strong>Short version:</strong> We collect only what we need to run the app. We never sell your data. We never store your bank credentials. You can request deletion of your account at any time.
          </p>
        </div>

        {/* Sections */}
        {sections.map((s, i) => (
          <div key={i} id={`s${i + 1}`} style={{ marginBottom: 48, paddingBottom: 48, borderBottom: i < sections.length - 1 ? "1px solid #E2E8F0" : "none" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, minWidth: 26, background: "#EDE9FE", color: "#7C3AED", borderRadius: "50%", fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
              {s.title}
            </h2>
            {s.content}
          </div>
        ))}

        {/* Footer */}
        <div style={{ paddingTop: 32, borderTop: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LogoMark size={18} color="#7C3AED" />
            <span style={{ fontSize: 12, color: "#94A3B8" }}>© 2026 MyMate · ABN 00 000 000 000</span>
          </div>
          <a href="mailto:nex.labau@gmail.com" style={{ fontSize: 12, color: "#7C3AED", textDecoration: "none" }}>nex.labau@gmail.com</a>
        </div>
      </div>
    </div>
  );
}

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.75, marginBottom: 12 }}>{children}</p>
);

const Bullets = ({ items }: { items: string[] }) => (
  <ul style={{ listStyle: "none", padding: 0, margin: "12px 0", display: "flex", flexDirection: "column", gap: 8 }}>
    {items.map((item, i) => (
      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#475569", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "10px 14px" }}>
        <span style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: "#7C3AED", marginTop: 5 }} />
        <span dangerouslySetInnerHTML={{ __html: item }} />
      </li>
    ))}
  </ul>
);

const RightsGrid = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, margin: "14px 0" }}>
    {[
      ["Access", "Request a copy of all personal information we hold about you."],
      ["Correction", "Ask us to correct inaccurate or incomplete information."],
      ["Deletion", "Request that we delete your account and all associated data."],
      ["Complaint", "Lodge a complaint with us or the OAIC if we handle your data incorrectly."],
    ].map(([title, desc]) => (
      <div key={title} style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: 14, background: "white" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#7C3AED", marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>{desc}</div>
      </div>
    ))}
  </div>
);

const sections = [
  {
    title: "Information We Collect",
    content: (
      <>
        <P>We collect information in two ways: information you give us directly, and information generated automatically when you use MyMate.</P>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 6, marginTop: 12 }}>Information you provide directly</p>
        <Bullets items={[
          "Your name and email address, provided when you sign in with Google",
          "Financial account details you add manually (account name, type, balance, currency)",
          "Transactions you record, including amount, category, date, and notes",
          "Savings goals and target amounts you set in the app",
          "Preferences such as currency, language, and notification settings",
        ]} />
        <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 6, marginTop: 16 }}>Information collected automatically</p>
        <Bullets items={[
          "Log data: device type, operating system, IP address, and app version",
          "Usage patterns: which features you use and how frequently",
          "Error reports if the app crashes or encounters an issue",
        ]} />
        <div style={{ background: "#EDE9FE", border: "1px solid #DDD6FE", borderLeft: "3px solid #7C3AED", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginTop: 16 }}>
          <p style={{ fontSize: 13, color: "#5B21B6", lineHeight: 1.6, margin: 0 }}>
            <strong>We never collect your bank credentials.</strong> MyMate does not connect directly to your bank or request internet banking passwords. All financial data in the app is entered by you manually.
          </p>
        </div>
      </>
    ),
  },
  {
    title: "How We Use Your Data",
    content: (
      <>
        <P>We use the information we collect to provide, maintain, and improve MyMate. Specifically:</P>
        <Bullets items={[
          "To authenticate your identity and give you access to your account",
          "To display your financial summary, transactions, and goals within the app",
          "To generate spending reports (weekly and monthly) when you enable them",
          "To personalise budget guidance based on your transaction history",
          "To send notifications you have opted into (e.g. weekly report emails)",
          "To diagnose technical problems and improve app performance",
          "To comply with our legal obligations under Australian law",
        ]} />
        <P>We do not use your financial data to make automated decisions that affect your legal rights, nor do we use it for targeted advertising.</P>
      </>
    ),
  },
  {
    title: "Data Storage & Security",
    content: (
      <>
        <P>Your data is stored securely in Supabase, a cloud database provider using PostgreSQL with row-level security. Data is encrypted at rest and in transit using TLS 1.3.</P>
        <Bullets items={[
          "Servers are located in Australia or the United States depending on your region",
          "Row-level security policies ensure you can only access your own data",
          "Authentication is handled through Google OAuth 2.0 — we never store your Google password",
          "App preferences (currency, language) are stored locally on your device using localStorage",
        ]} />
        <P>If we become aware of a data breach likely to cause serious harm, we will notify you and the Office of the Australian Information Commissioner (OAIC) within 30 days, as required by the Notifiable Data Breaches scheme.</P>
      </>
    ),
  },
  {
    title: "Sharing Information",
    content: (
      <>
        <P>We do not sell, rent, or trade your personal information to third parties. We may share data only in the following limited circumstances:</P>
        <Bullets items={[
          "<strong>Service providers:</strong> Supabase (database), Vercel (hosting), and Google (authentication) — only the data they need to provide their service",
          "<strong>Legal requirements:</strong> If required by Australian law, court order, or to protect the safety of users",
          "<strong>Business transfer:</strong> In the event of a merger or acquisition, your data may transfer to the new entity, which will be bound by this policy",
        ]} />
        <P>Any third-party service provider we engage is bound by data processing agreements and is not permitted to use your data for their own purposes.</P>
      </>
    ),
  },
  {
    title: "Your Rights",
    content: (
      <>
        <P>Under the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs), you have the following rights:</P>
        <RightsGrid />
        <P>To exercise any of these rights, contact us at <strong>nex.labau@gmail.com</strong>. We will respond within 30 days. If you are unsatisfied, you may contact the OAIC at oaic.gov.au.</P>
      </>
    ),
  },
  {
    title: "Cookies & Local Storage",
    content: (
      <>
        <Bullets items={[
          "<strong>Authentication cookies:</strong> Set by NextAuth to keep you signed in across sessions. These are essential and cannot be disabled.",
          "<strong>localStorage:</strong> Stores your in-app preferences locally on your device (currency, language, notifications, report toggles). This data never leaves your device.",
        ]} />
        <P>We do not use advertising cookies, analytics cookies, or any third-party tracking cookies.</P>
      </>
    ),
  },
  {
    title: "Third-Party Services",
    content: (
      <>
        <P>MyMate integrates with the following third-party services. Each has its own privacy policy:</P>
        <Bullets items={[
          "<strong>Google OAuth</strong> — used for sign-in. See policies.google.com/privacy",
          "<strong>Supabase</strong> — database and backend. See supabase.com/privacy",
          "<strong>Vercel</strong> — hosting and deployment. See vercel.com/legal/privacy-policy",
        ]} />
      </>
    ),
  },
  {
    title: "Children's Privacy",
    content: (
      <>
        <P>MyMate is not intended for use by anyone under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child under 18 has created an account, we will delete that account and all associated data promptly.</P>
        <P>If you believe a child has registered with MyMate, please contact us immediately at <strong>nex.labau@gmail.com</strong>.</P>
      </>
    ),
  },
  {
    title: "Changes to This Policy",
    content: (
      <>
        <P>We may update this Privacy Policy from time to time. When we make material changes, we will:</P>
        <Bullets items={[
          "Update the effective date at the top of this page",
          "Notify you by email at least 14 days before changes take effect",
          "Display an in-app notification so you cannot miss it",
        ]} />
        <P>Your continued use of MyMate after the effective date constitutes acceptance of the updated policy.</P>
      </>
    ),
  },
  {
    title: "Contact Us",
    content: (
      <>
        <P>If you have questions, concerns, or requests relating to this Privacy Policy:</P>
        <Bullets items={[
          "<strong>Email:</strong> nex.labau@gmail.com",
          "<strong>In-app:</strong> Settings → Help & Support → Privacy Request",
          "<strong>Response time:</strong> We aim to respond within 5 business days",
        ]} />
        <P>If you are not satisfied, you have the right to make a complaint to the OAIC at oaic.gov.au or by calling 1300 363 992.</P>
      </>
    ),
  },
];

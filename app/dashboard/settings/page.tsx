"use client";
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  User,
  Mail,
  Bell,
  Globe,
  DollarSign,
  Shield,
  ChevronRight,
  Check,
  Pencil,
  X,
  BarChart3,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Calendar,
  CalendarDays,
  Eye,
} from "lucide-react";
import { useTransactions, useAccounts, ACCOUNT_META } from "@/app/lib/store";

const currencies = ["AUD", "USD", "BRL", "GBP", "EUR", "INR", "PHP", "NZD"];
const languages = ["English", "Português", "Hindi", "Filipino", "Mandarin", "Spanish"];

const CAT_LABELS: Record<string, string> = {
  food: "Food & Dining", transport: "Transport", shopping: "Shopping",
  bills: "Bills & Utilities", entertainment: "Entertainment", health: "Health",
  travel: "Travel", home: "Home & Rent", income: "Income", other: "Other",
};
const CAT_COLORS: Record<string, string> = {
  food: "#F43F5E", transport: "#7C3AED", shopping: "#F59E0B",
  bills: "#06B6D4", entertainment: "#10B981", health: "#EC4899",
  travel: "#8B5CF6", home: "#64748B", income: "#10B981", other: "#94A3B8",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 2 }).format(Math.abs(n));
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{ width: 48, height: 28, borderRadius: 100, border: "none", cursor: "pointer", background: on ? "#7C3AED" : "#E2E8F0", position: "relative", flexShrink: 0 }}
    >
      <div style={{ position: "absolute", top: 4, left: on ? 24 : 4, width: 20, height: 20, borderRadius: "50%", background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
    </button>
  );
}

function ReportModal({ type, onClose }: { type: "weekly" | "monthly"; onClose: () => void }) {
  const { transactions } = useTransactions();
  const { accounts } = useAccounts();

  const now = new Date();
  const startDate = type === "weekly"
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
    : new Date(now.getFullYear(), now.getMonth(), 1);

  const startKey = startDate.toISOString().split("T")[0];
  const endKey = now.toISOString().split("T")[0];

  const periodLabel = type === "weekly" ? "Weekly Report" : "Monthly Report";
  const periodSub = type === "weekly"
    ? `${startDate.toLocaleDateString("en-AU", { day: "numeric", month: "short" })} – ${now.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}`
    : now.toLocaleDateString("en-AU", { month: "long", year: "numeric" });

  const periodTxs = useMemo(
    () => transactions.filter((t) => t.date >= startKey && t.date <= endKey),
    [transactions, startKey, endKey],
  );

  const income = useMemo(() => periodTxs.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0), [periodTxs]);
  const spent  = useMemo(() => periodTxs.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0), [periodTxs]);
  const net = income - spent;

  const categories = useMemo(() => {
    const totals: Record<string, number> = {};
    periodTxs.filter((t) => t.amount < 0).forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(totals)
      .map(([id, value]) => ({ id, value, label: CAT_LABELS[id] ?? id, color: CAT_COLORS[id] ?? "#94A3B8" }))
      .sort((a, b) => b.value - a.value);
  }, [periodTxs]);

  const maxCat = categories[0]?.value || 1;
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const savingsRate = income > 0 ? Math.round((net / income) * 100) : 0;

  const srColor = savingsRate >= 20 ? "#10B981" : savingsRate >= 10 ? "#F59E0B" : "#F43F5E";
  const srBg    = savingsRate >= 20 ? "#ECFDF5" : savingsRate >= 10 ? "#FFFBEB" : "#FFF1F2";

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.5)", overflowY: "auto", padding: "24px 16px" }}
      onClick={onClose}
    >
      <div
        style={{ maxWidth: 580, margin: "0 auto", background: "white", borderRadius: 24, overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dark header */}
        <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)", padding: "28px 28px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(124,58,237,0.15)", pointerEvents: "none" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginBottom: 4 }}>{periodSub}</p>
              <h2 style={{ color: "white", fontSize: 20, fontWeight: 800 }}>{periodLabel}</h2>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: 8, cursor: "pointer", color: "white", display: "flex", alignItems: "center" }}>
              <X size={18} />
            </button>
          </div>

          {/* 3 stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Income",              value: income,       color: "#34D399", icon: ArrowDownLeft },
              { label: "Spent",               value: spent,        color: "#FB7185", icon: ArrowUpRight  },
              { label: net >= 0 ? "Saved" : "Over", value: Math.abs(net), color: net >= 0 ? "#A78BFA" : "#FB7185", icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                  <s.icon size={12} color={s.color} />
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{s.label}</p>
                </div>
                <p style={{ color: s.color, fontWeight: 800, fontSize: 16 }}>{s.value === 0 ? "$0.00" : fmt(s.value)}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 22 }}>
          {/* Savings rate banner */}
          {income > 0 && (
            <div style={{ background: srBg, borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>Savings rate this period</p>
                <p style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>
                  {savingsRate >= 20 ? "Great — above the 20% target!" : savingsRate >= 10 ? "Getting there — aim for 20%" : "Below target — review your spending"}
                </p>
              </div>
              <p style={{ fontWeight: 800, fontSize: 28, color: srColor, letterSpacing: "-0.5px" }}>{savingsRate}%</p>
            </div>
          )}

          {/* Category breakdown */}
          {categories.length > 0 && (
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 14 }}>Spending by Category</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: "#0F172A", fontWeight: 500 }}>{cat.label}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{fmt(cat.value)}</span>
                    </div>
                    <div style={{ background: "#F1F5F9", borderRadius: 4, height: 6, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(cat.value / maxCat) * 100}%`, background: cat.color, borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Account snapshot */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>Account Snapshot</h3>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED" }}>Total: {fmt(totalBalance)}</span>
            </div>
            {accounts.length === 0 ? (
              <p style={{ fontSize: 13, color: "#94A3B8" }}>No accounts added yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {accounts.map((acc) => {
                  const meta = ACCOUNT_META[acc.type];
                  return (
                    <div key={acc.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#F8FAFC", borderRadius: 12, border: "1px solid #F1F5F9" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: meta.color, flexShrink: 0 }} />
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 13, color: "#0F172A" }}>{acc.name}</p>
                          <p style={{ fontSize: 11, color: "#94A3B8" }}>{acc.institution} · {acc.currency}</p>
                        </div>
                      </div>
                      <p style={{ fontWeight: 700, fontSize: 14, color: acc.balance < 0 ? "#F43F5E" : "#0F172A" }}>
                        {acc.balance < 0 ? "-" : ""}{fmt(acc.balance)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Empty state */}
          {periodTxs.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px", background: "#F8FAFC", borderRadius: 14 }}>
              <BarChart3 size={28} color="#CBD5E1" style={{ margin: "0 auto 8px", display: "block" }} />
              <p style={{ fontSize: 13, color: "#94A3B8" }}>No transactions found for this period.</p>
            </div>
          )}

          <button onClick={onClose} style={{ width: "100%", padding: "14px", background: "#7C3AED", border: "none", borderRadius: 14, color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { data: session } = useSession();

  const [displayName, setDisplayName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savedName, setSavedName] = useState(false);

  const [currency, setCurrency] = useState("AUD");
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState({
    unusualSpending: true,
    billReminders: true,
    fxAlerts: false,
  });
  const [reports, setReports] = useState({ weekly: false, monthly: true });
  const [showReport, setShowReport] = useState<"weekly" | "monthly" | null>(null);

  useEffect(() => {
    const saved        = localStorage.getItem("mymate_displayName");
    const savedCurrency = localStorage.getItem("mymate_currency");
    const savedLanguage = localStorage.getItem("mymate_language");
    const savedNotifs   = localStorage.getItem("mymate_notifications");
    const savedReports  = localStorage.getItem("mymate_reports");

    if (saved) setDisplayName(saved);
    else if (session?.user?.name) setDisplayName(session.user.name);
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedLanguage)  setLanguage(savedLanguage);
    if (savedNotifs)    setNotifications(JSON.parse(savedNotifs));
    if (savedReports)   setReports(JSON.parse(savedReports));
  }, [session]);

  const startEditName = () => { setNameInput(displayName); setEditingName(true); setSavedName(false); };

  const saveName = () => {
    if (!nameInput.trim()) return;
    setDisplayName(nameInput.trim());
    localStorage.setItem("mymate_displayName", nameInput.trim());
    setEditingName(false);
    setSavedName(true);
    setTimeout(() => setSavedName(false), 2500);
  };

  const saveCurrency = (c: string) => { setCurrency(c); localStorage.setItem("mymate_currency", c); };
  const saveLanguage  = (l: string) => { setLanguage(l);  localStorage.setItem("mymate_language", l); };

  const toggleNotification = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem("mymate_notifications", JSON.stringify(updated));
  };

  const toggleReport = (key: "weekly" | "monthly") => {
    const updated = { ...reports, [key]: !reports[key] };
    setReports(updated);
    localStorage.setItem("mymate_reports", JSON.stringify(updated));
  };

  const cardStyle = {
    background: "white",
    borderRadius: 20,
    border: "1px solid #F1F5F9",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)" as const,
    marginBottom: 20,
  };

  return (
    <div style={{ padding: "24px", maxWidth: 720, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>Settings</h1>
        <p style={{ color: "#64748B", fontSize: 14, marginTop: 4 }}>Manage your profile and preferences</p>
      </div>

      {/* ── Profile card ─────────────────────────────────────────────────── */}
      <div style={{ ...cardStyle, overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", height: 80 }} />
        <div style={{ padding: "0 28px 28px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 18, marginTop: -36, marginBottom: 24 }}>
            <div>
              {session?.user?.image ? (
                <Image src={session.user.image} alt="Profile" width={72} height={72} style={{ borderRadius: 18, border: "4px solid white", objectFit: "cover", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }} />
              ) : (
                <div style={{ width: 72, height: 72, borderRadius: 18, border: "4px solid white", background: "linear-gradient(135deg, #7C3AED, #10B981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "white", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}>
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div style={{ paddingBottom: 4 }}>
              <p style={{ fontWeight: 800, fontSize: 20, color: "#0F172A", lineHeight: 1.2 }}>{displayName || session?.user?.name || "..."}</p>
              <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>{session?.user?.email}</p>
            </div>
          </div>

          {/* Display name */}
          <div style={{ background: "#F8FAFC", borderRadius: 14, padding: "18px 20px", border: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: editingName ? 14 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={16} color="#7C3AED" />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Display Name</p>
                  {!editingName && <p style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginTop: 1 }}>{displayName || session?.user?.name || "—"}</p>}
                </div>
              </div>
              {!editingName && (
                <button onClick={startEditName} style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1px solid #E2E8F0", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#7C3AED" }}>
                  <Pencil size={13} /> Edit
                </button>
              )}
            </div>
            {editingName && (
              <div style={{ display: "flex", gap: 10 }}>
                <input autoFocus value={nameInput} onChange={(e) => setNameInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveName()} placeholder="Your display name" style={{ flex: 1, border: "2px solid #7C3AED", borderRadius: 10, padding: "10px 14px", fontSize: 15, fontWeight: 600, color: "#0F172A", outline: "none", background: "white" }} />
                <button onClick={saveName} style={{ background: "#7C3AED", border: "none", borderRadius: 10, padding: "10px 18px", cursor: "pointer", color: "white", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <Check size={15} /> Save
                </button>
                <button onClick={() => setEditingName(false)} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "10px 12px", cursor: "pointer", color: "#64748B", display: "flex", alignItems: "center" }}>
                  <X size={15} />
                </button>
              </div>
            )}
          </div>

          {savedName && (
            <div style={{ marginTop: 12, background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#065F46" }}>
              <Check size={15} /> Display name updated!
            </div>
          )}

          {/* Email */}
          <div style={{ background: "#F8FAFC", borderRadius: 14, padding: "16px 20px", border: "1px solid #F1F5F9", marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ECFEFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Mail size={16} color="#06B6D4" />
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email (Google)</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#64748B", marginTop: 1 }}>{session?.user?.email ?? "—"}</p>
            </div>
            <div style={{ marginLeft: "auto", background: "#F1F5F9", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8" }}>via Google</div>
          </div>
        </div>
      </div>

      {/* ── Preferences ──────────────────────────────────────────────────── */}
      <div style={{ ...cardStyle, padding: "24px 28px" }}>
        <h2 style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", marginBottom: 20 }}>Preferences</h2>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }}><DollarSign size={16} color="#10B981" /></div>
            <div><p style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>Base Currency</p><p style={{ fontSize: 12, color: "#94A3B8" }}>All totals shown in this currency</p></div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {currencies.map((c) => (
              <button key={c} onClick={() => saveCurrency(c)} style={{ padding: "8px 16px", borderRadius: 10, border: currency === c ? "2px solid #10B981" : "1px solid #E2E8F0", background: currency === c ? "#ECFDF5" : "white", color: currency === c ? "#065F46" : "#64748B", fontWeight: currency === c ? 700 : 500, fontSize: 13, cursor: "pointer" }}>{c}</button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center" }}><Globe size={16} color="#7C3AED" /></div>
            <div><p style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>Language</p><p style={{ fontSize: 12, color: "#94A3B8" }}>App display language</p></div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {languages.map((l) => (
              <button key={l} onClick={() => saveLanguage(l)} style={{ padding: "8px 16px", borderRadius: 10, border: language === l ? "2px solid #7C3AED" : "1px solid #E2E8F0", background: language === l ? "#F5F3FF" : "white", color: language === l ? "#5B21B6" : "#64748B", fontWeight: language === l ? 700 : 500, fontSize: 13, cursor: "pointer" }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reports ──────────────────────────────────────────────────────── */}
      <div style={{ ...cardStyle, padding: "24px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BarChart3 size={16} color="#7C3AED" />
          </div>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 16, color: "#0F172A" }}>Reports</h2>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20, paddingLeft: 46 }}>
          Enable automatic summaries of your spending for each period.
        </p>

        {[
          {
            key: "weekly" as const,
            label: "Weekly Report",
            sub: "Summary every Monday — last 7 days of transactions",
            icon: CalendarDays,
            color: "#7C3AED",
            bg: "#F5F3FF",
          },
          {
            key: "monthly" as const,
            label: "Monthly Report",
            sub: "Full month overview — income, spending and savings rate",
            icon: Calendar,
            color: "#10B981",
            bg: "#ECFDF5",
          },
        ].map((item, i, arr) => (
          <div
            key={item.key}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0", borderBottom: i < arr.length - 1 ? "1px solid #F8FAFC" : "none" }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <item.icon size={18} color={item.color} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{item.label}</p>
              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{item.sub}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => setShowReport(item.key)}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 10, border: "1px solid #E2E8F0", background: "white", color: "#7C3AED", fontWeight: 600, fontSize: 12, cursor: "pointer" }}
              >
                <Eye size={13} /> Preview
              </button>
              <Toggle on={reports[item.key]} onToggle={() => toggleReport(item.key)} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Notifications ────────────────────────────────────────────────── */}
      <div style={{ ...cardStyle, padding: "24px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center" }}><Bell size={16} color="#F59E0B" /></div>
          <h2 style={{ fontWeight: 700, fontSize: 16, color: "#0F172A" }}>Notifications</h2>
        </div>
        {[
          { key: "unusualSpending", label: "Unusual spending alerts", sub: "When you spend more than usual" },
          { key: "billReminders",   label: "Bill reminders",          sub: "3 days before due date" },
          { key: "fxAlerts",        label: "FX rate alerts",          sub: "When your target rate is hit" },
        ].map((item, i, arr) => (
          <div key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid #F8FAFC" : "none" }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{item.label}</p>
              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{item.sub}</p>
            </div>
            <Toggle on={notifications[item.key as keyof typeof notifications]} onToggle={() => toggleNotification(item.key as keyof typeof notifications)} />
          </div>
        ))}
      </div>

      {/* ── Account ──────────────────────────────────────────────────────── */}
      <div style={{ ...cardStyle, overflow: "hidden" }}>
        <div style={{ padding: "24px 28px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}><Shield size={16} color="#64748B" /></div>
            <h2 style={{ fontWeight: 700, fontSize: 16, color: "#0F172A" }}>Account</h2>
          </div>
        </div>
        {[
          { label: "Privacy Policy",  sub: "How we handle your data" },
          { label: "Terms of Service", sub: "Our terms and conditions" },
          { label: "Export my data",  sub: "Download all your financial data" },
        ].map((item, i) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", padding: "14px 28px", borderTop: i === 0 ? "1px solid #F8FAFC" : "none", cursor: "pointer" }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{item.label}</p>
              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{item.sub}</p>
            </div>
            <ChevronRight size={16} color="#CBD5E1" />
          </div>
        ))}
        <div style={{ padding: "16px 28px 24px" }}>
          <button style={{ width: "100%", padding: "14px", borderRadius: 12, border: "1px solid #FEE2E2", background: "#FFF1F2", color: "#F43F5E", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            Delete Account
          </button>
        </div>
      </div>

      <p style={{ textAlign: "center", color: "#CBD5E1", fontSize: 12, marginTop: 24 }}>
        MyMate v1.0.0 · Built for Australia
      </p>

      {/* Report Modal */}
      {showReport && <ReportModal type={showReport} onClose={() => setShowReport(null)} />}
    </div>
  );
}

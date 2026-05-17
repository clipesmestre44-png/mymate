"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  Globe,
  ShieldCheck,
  Zap,
  Home,
  Car,
  BookOpen,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useTransactions } from "@/app/lib/store";

// ── Category buckets for 50/30/20 ────────────────────────────────────────────
const NEEDS_CATS = new Set(["home", "bills", "transport", "health"]);
const WANTS_CATS = new Set(["food", "shopping", "entertainment", "travel", "other"]);

// ── Goals (localStorage) ─────────────────────────────────────────────────────
const GOAL_COLORS = ["#7C3AED", "#10B981", "#F59E0B", "#06B6D4", "#F43F5E", "#8B5CF6"];

interface Goal { id: string; label: string; target: number; current: number; color: string }

function readLS<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
}

function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  useEffect(() => { setGoals(readLS("mymate_goals", [])); }, []);

  const save = (next: Goal[]) => {
    localStorage.setItem("mymate_goals", JSON.stringify(next));
    setGoals(next);
  };

  const addGoal = (data: Omit<Goal, "id">) =>
    save([...goals, { ...data, id: crypto.randomUUID() }]);

  const deleteGoal = (id: string) => save(goals.filter((g) => g.id !== id));

  const updateGoal = (id: string, updates: Partial<Goal>) =>
    save(goals.map((g) => (g.id === id ? { ...g, ...updates } : g)));

  return { goals, addGoal, deleteGoal, updateGoal };
}

// ── Checklist (localStorage) ─────────────────────────────────────────────────
const CHECKLIST = [
  "Open an Australian bank account",
  "Get a Tax File Number (TFN)",
  "Register for myGov + link ATO",
  "Set up superannuation account",
  "Get a secured credit card to build credit history",
  "Take out private health insurance (optional)",
  "File first Australian tax return",
];

function useChecklist() {
  const [done, setDone] = useState<boolean[]>(() => Array(CHECKLIST.length).fill(false));
  useEffect(() => { setDone(readLS("mymate_checklist", Array(CHECKLIST.length).fill(false))); }, []);

  const toggle = (i: number) => {
    const next = done.map((v, j) => (j === i ? !v : v));
    localStorage.setItem("mymate_checklist", JSON.stringify(next));
    setDone(next);
  };

  return { done, toggle };
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtCurrency(n: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
}

const tabs = [
  { id: "budget", label: "50/30/20 Budget", icon: Target },
  { id: "tips", label: "Smart Tips", icon: Lightbulb },
  { id: "goals", label: "Goals", icon: TrendingUp },
  { id: "immigrant", label: "New to AU 🇦🇺", icon: Globe },
];

const STATIC_TIPS = [
  {
    icon: ShieldCheck,
    color: "#06B6D4",
    bg: "#ECFEFF",
    title: "Build your AU credit history faster",
    body: "As a newcomer, getting an Afterpay account and a secured credit card (e.g. Bankwest Zero) and paying them off monthly are the fastest ways to build a credit score.",
  },
  {
    icon: Globe,
    color: "#7C3AED",
    bg: "#F5F3FF",
    title: "Send money home cheaper",
    body: "Wise and Remitly typically beat bank rates for international transfers. Compare rates before each transfer — savings of $15–30 per $500 add up quickly.",
  },
  {
    icon: TrendingUp,
    color: "#10B981",
    bg: "#ECFDF5",
    title: "Make your savings work harder",
    body: "ING Savings Maximiser, Ubank, and Macquarie all offer rates above 5.5% p.a. Moving idle savings from a big-4 bank can earn hundreds extra per year.",
  },
  {
    icon: BookOpen,
    color: "#F59E0B",
    bg: "#FFFBEB",
    title: "Superannuation is your future wealth",
    body: "Your employer contributes 11.5% of your salary to super. Log in to check your fund's performance and consider consolidating multiple accounts to avoid duplicate fees.",
  },
];

// ── Add Goal Modal ────────────────────────────────────────────────────────────
function AddGoalModal({ onClose, onSave, nextColor }: { onClose: () => void; onSave: (g: Omit<Goal, "id">) => void; nextColor: string }) {
  const [label, setLabel] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!label.trim()) { setError("Enter a goal name."); return; }
    const t = parseFloat(target);
    const c = parseFloat(current || "0");
    if (!target || isNaN(t) || t <= 0) { setError("Enter a valid target amount."); return; }
    onSave({ label: label.trim(), target: t, current: c, color: nextColor });
    onClose();
  };

  const inputStyle = { width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "10px 14px", fontSize: 14, color: "#0F172A", background: "white", outline: "none", boxSizing: "border-box" as const };
  const labelStyle = { fontSize: 12, fontWeight: 600 as const, color: "#64748B", display: "block" as const, marginBottom: 6 };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: "24px 24px 0 0", padding: "28px 24px 40px", width: "100%", maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "#E2E8F0", margin: "0 auto 20px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>New Goal</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><X size={20} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Goal name</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Emergency Fund, Holiday..." style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Target amount (AUD)</label>
            <input type="number" min="0" step="1" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="0" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Amount already saved (AUD)</label>
            <input type="number" min="0" step="1" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="0" style={inputStyle} />
          </div>
        </div>
        {error && <p style={{ color: "#F43F5E", fontSize: 13, marginTop: 10 }}>{error}</p>}
        <button onClick={handleSave} style={{ width: "100%", marginTop: 24, padding: "14px", background: "linear-gradient(135deg, #7C3AED, #4C1D95)", borderRadius: 14, border: "none", color: "white", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
          Save Goal
        </button>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function GuidePage() {
  const [tab, setTab] = useState("budget");
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [manualIncome, setManualIncome] = useState("");

  const { transactions } = useTransactions();
  const { goals, addGoal, deleteGoal } = useGoals();
  const { done, toggle } = useChecklist();

  // ── 50/30/20 calculations ─────────────────────────────────────────────────
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisMonth = useMemo(() => transactions.filter((t) => t.date.startsWith(monthKey)), [transactions, monthKey]);

  const incomeFromTxs = useMemo(
    () => thisMonth.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0),
    [thisMonth],
  );
  const income = incomeFromTxs || parseFloat(manualIncome) || 0;

  const needsActual = useMemo(
    () => thisMonth.filter((t) => t.amount < 0 && NEEDS_CATS.has(t.category)).reduce((s, t) => s + Math.abs(t.amount), 0),
    [thisMonth],
  );
  const wantsActual = useMemo(
    () => thisMonth.filter((t) => t.amount < 0 && WANTS_CATS.has(t.category)).reduce((s, t) => s + Math.abs(t.amount), 0),
    [thisMonth],
  );
  const totalSpent = needsActual + wantsActual;
  const savingsActual = Math.max(0, income - totalSpent);

  const needsBudget = income * 0.5;
  const wantsBudget = income * 0.3;
  const savingsBudget = income * 0.2;

  // ── Dynamic tips ──────────────────────────────────────────────────────────
  const dynamicTips = useMemo(() => {
    const t: typeof STATIC_TIPS = [];
    if (income > 0 && totalSpent > income) {
      t.push({ icon: AlertTriangle, color: "#F43F5E", bg: "#FFF1F2", title: "You spent more than you earned this month", body: `Your expenses (${fmtCurrency(totalSpent)}) exceeded your income (${fmtCurrency(income)}) by ${fmtCurrency(totalSpent - income)}. Review your wants spending to get back on track.` });
    }
    if (income > 0 && needsActual > income * 0.55) {
      t.push({ icon: Home, color: "#F59E0B", bg: "#FFFBEB", title: "Essential expenses are high", body: `Your needs spending (${fmtCurrency(needsActual)}) is ${((needsActual / income) * 100).toFixed(0)}% of income — above the recommended 50%. Housing or bills may be worth reviewing.` });
    }
    if (income > 0 && savingsActual < income * 0.1 && totalSpent < income) {
      t.push({ icon: Zap, color: "#10B981", bg: "#ECFDF5", title: "Boost your savings rate", body: `You saved ${fmtCurrency(savingsActual)} this month (${((savingsActual / income) * 100).toFixed(0)}%). The 50/30/20 rule targets 20% — that would be ${fmtCurrency(income * 0.2)}.` });
    }
    return t;
  }, [income, totalSpent, needsActual, savingsActual]);

  const allTips = [...dynamicTips, ...STATIC_TIPS];
  const nextColor = GOAL_COLORS[goals.length % GOAL_COLORS.length];
  const checklistDone = done.filter(Boolean).length;

  return (
    <div style={{ padding: "24px", maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>Spending Guide</h1>
        <p style={{ color: "#64748B", fontSize: 14, marginTop: 2 }}>Personalised insights to help you spend smarter</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "white", borderRadius: 16, padding: 4, border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 28, overflowX: "auto" }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: tab === id ? "#7C3AED" : "transparent", color: tab === id ? "white" : "#64748B", whiteSpace: "nowrap" }}
          >
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {/* ── 50/30/20 Tab ───────────────────────────────────────────────────── */}
      {tab === "budget" && (
        <div>
          <div style={{ background: "linear-gradient(135deg, #0F172A, #1E1B4B)", borderRadius: 24, padding: "28px 32px", marginBottom: 24 }}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 4 }}>Monthly Income</p>
            {incomeFromTxs > 0 ? (
              <>
                <p style={{ color: "white", fontSize: 36, fontWeight: 800, letterSpacing: "-1px", marginBottom: 8 }}>
                  {fmtCurrency(incomeFromTxs)}
                </p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>From your income transactions this month</p>
              </>
            ) : (
              <>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 12 }}>
                  No income transactions recorded yet. Enter your monthly income to see your budget:
                </p>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={manualIncome}
                  onChange={(e) => setManualIncome(e.target.value)}
                  placeholder="e.g. 4500"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "12px 16px", fontSize: 20, fontWeight: 700, color: "white", outline: "none", width: "100%", boxSizing: "border-box" }}
                />
              </>
            )}
            {income > 0 && (
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.5, marginTop: 16 }}>
                The 50/30/20 rule: <strong style={{ color: "white" }}>50% needs</strong>, <strong style={{ color: "white" }}>30% wants</strong>, <strong style={{ color: "white" }}>20% savings</strong>.
              </p>
            )}
          </div>

          {income === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", background: "white", borderRadius: 20, border: "1px solid #F1F5F9" }}>
              <Target size={32} color="#CBD5E1" style={{ margin: "0 auto 12px", display: "block" }} />
              <p style={{ fontWeight: 600, color: "#94A3B8" }}>Enter your income above to see your 50/30/20 breakdown</p>
            </div>
          ) : (
            [
              { label: "Needs", sub: "Rent, bills, transport, health", budget: needsBudget, actual: needsActual, targetPct: 50, color: "#7C3AED", icons: [Home, Zap, Car] },
              { label: "Wants", sub: "Food, shopping, entertainment, travel", budget: wantsBudget, actual: wantsActual, targetPct: 30, color: "#F59E0B", icons: [Car, BookOpen] },
              { label: "Savings & Investing", sub: "What's left after spending", budget: savingsBudget, actual: savingsActual, targetPct: 20, color: "#10B981", icons: [TrendingUp, ShieldCheck] },
            ].map((row) => {
              const over = row.actual > row.budget;
              const pct = income > 0 ? (row.actual / income) * 100 : 0;
              return (
                <div key={row.label} style={{ background: "white", borderRadius: 20, padding: "22px 24px", border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 16, color: "#0F172A" }}>{row.label}</p>
                      <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{row.sub}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: 800, fontSize: 18, color: over ? "#F43F5E" : "#0F172A" }}>
                        {fmtCurrency(row.actual)}
                      </p>
                      <p style={{ fontSize: 12, color: "#94A3B8" }}>of {fmtCurrency(row.budget)} budget</p>
                    </div>
                  </div>
                  <div style={{ background: "#F1F5F9", borderRadius: 6, height: 8, marginBottom: 10, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min((row.actual / row.budget) * 100, 100)}%`, background: over ? "#F43F5E" : row.color, borderRadius: 6 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#94A3B8" }}>{pct.toFixed(1)}% of income · target {row.targetPct}%</span>
                    {over ? (
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#F43F5E", display: "flex", alignItems: "center", gap: 4 }}>
                        <AlertTriangle size={12} /> {fmtCurrency(row.actual - row.budget)} over
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#10B981", display: "flex", alignItems: "center", gap: 4 }}>
                        <CheckCircle2 size={12} /> {fmtCurrency(row.budget - row.actual)} under
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Smart Tips Tab ─────────────────────────────────────────────────── */}
      {tab === "tips" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {allTips.map((tip, i) => {
            const TipIcon = tip.icon;
            return (
              <div key={i} style={{ background: "white", borderRadius: 20, padding: "22px 24px", border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: tip.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <TipIcon size={22} color={tip.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 6 }}>{tip.title}</p>
                  <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>{tip.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Goals Tab ──────────────────────────────────────────────────────── */}
      {tab === "goals" && (
        <div>
          {goals.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", background: "white", borderRadius: 20, border: "1px solid #F1F5F9", marginBottom: 16 }}>
              <TrendingUp size={32} color="#CBD5E1" style={{ margin: "0 auto 12px", display: "block" }} />
              <p style={{ fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>No goals yet</p>
              <p style={{ fontSize: 13, color: "#94A3B8" }}>Add a savings goal to track your progress</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
              {goals.map((goal) => {
                const pct = Math.min((goal.current / goal.target) * 100, 100);
                return (
                  <div key={goal.id} style={{ background: "white", borderRadius: 20, padding: "24px", border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${goal.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Target size={20} color={goal.color} />
                        </div>
                        <p style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{goal.label}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: goal.color }}>{Math.round(pct)}%</span>
                        <button onClick={() => deleteGoal(goal.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#CBD5E1", padding: 4 }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div style={{ background: "#F1F5F9", borderRadius: 8, height: 10, marginBottom: 10, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: goal.color, borderRadius: 8 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, color: "#94A3B8" }}>{fmtCurrency(goal.current)} saved</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{fmtCurrency(goal.target)} goal</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setShowAddGoal(true)}
            style={{ width: "100%", padding: "14px", borderRadius: 14, border: "2px dashed #E2E8F0", background: "white", cursor: "pointer", fontWeight: 600, fontSize: 14, color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Plus size={16} /> Add a new goal
          </button>

          {showAddGoal && (
            <AddGoalModal onClose={() => setShowAddGoal(false)} onSave={addGoal} nextColor={nextColor} />
          )}
        </div>
      )}

      {/* ── New to AU Tab ──────────────────────────────────────────────────── */}
      {tab === "immigrant" && (
        <div>
          <div style={{ background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)", borderRadius: 24, padding: "28px 32px", marginBottom: 24 }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: "white", marginBottom: 8 }}>🇦🇺 New to Australia?</p>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 1.6 }}>
              We know starting fresh in a new country is a lot. Here&apos;s your financial checklist to get set up the right way.
            </p>
          </div>

          <div style={{ background: "white", borderRadius: 20, padding: "24px", border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: "#0F172A" }}>Your Australian Finance Checklist</h3>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#7C3AED" }}>{checklistDone}/{CHECKLIST.length} done</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {CHECKLIST.map((item, i) => (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, background: done[i] ? "#ECFDF5" : "#F8FAFC", border: `1px solid ${done[i] ? "#A7F3D0" : "#F1F5F9"}`, cursor: "pointer", textAlign: "left", width: "100%" }}
                >
                  <CheckCircle2 size={18} color={done[i] ? "#10B981" : "#CBD5E1"} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: done[i] ? 600 : 500, color: done[i] ? "#065F46" : "#64748B", textDecoration: done[i] ? "line-through" : "none" }}>
                    {item}
                  </span>
                  {!done[i] && (
                    <ChevronRight size={14} color="#CBD5E1" style={{ marginLeft: "auto", flexShrink: 0 }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { icon: Globe, color: "#7C3AED", bg: "#F5F3FF", title: "Send money home cheaper", body: "Compare Wise, Remitly, and Western Union for your country. You could save $15–30 per $500 transfer." },
              { icon: ShieldCheck, color: "#10B981", bg: "#ECFDF5", title: "How Aussie credit works", body: "No credit history from abroad transfers here. Learn how to build yours fast — starting day one." },
              { icon: TrendingUp, color: "#F59E0B", bg: "#FFFBEB", title: "Superannuation explained", body: "Your employer puts 11.5% of your salary into super. You may be able to take it home when you leave Australia." },
              { icon: BookOpen, color: "#06B6D4", bg: "#ECFEFF", title: "Tax for newcomers", body: "Understand when you become an Australian tax resident, what it means for foreign income, and EOFY tips." },
            ].map((card) => {
              const CardIcon = card.icon;
              return (
                <div key={card.title} style={{ background: "white", borderRadius: 18, padding: "20px", border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", cursor: "pointer" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <CardIcon size={20} color={card.color} />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", marginBottom: 6 }}>{card.title}</p>
                  <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>{card.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

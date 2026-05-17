"use client";
import { useState } from "react";
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
  Coffee,
  Car,
  BookOpen,
} from "lucide-react";

const budgetData = {
  income: 4200,
  needs: { budget: 2100, actual: 2280, label: "Needs (50%)" },
  wants: { budget: 1260, actual: 980, label: "Wants (30%)" },
  savings: { budget: 840, actual: 620, label: "Savings (20%)" },
};

const tips = [
  {
    id: 1,
    type: "warning",
    icon: AlertTriangle,
    color: "#F43F5E",
    bg: "#FFF1F2",
    title: "Rent is eating 43% of your income",
    body: "Australian financial advisors recommend keeping housing costs under 30% of income. Consider reviewing your rent or boosting your income.",
    action: "Explore options",
  },
  {
    id: 2,
    type: "tip",
    icon: Lightbulb,
    color: "#F59E0B",
    bg: "#FFFBEB",
    title: "Switch to ING's 5.5% savings rate",
    body: "Your $22,400 savings at 4.5% earns $1,008/year. Moving to ING Savings Maximiser (5.5%) would earn an extra $224 per year with no effort.",
    action: "Learn how",
  },
  {
    id: 3,
    type: "success",
    icon: CheckCircle2,
    color: "#10B981",
    bg: "#ECFDF5",
    title: "Great job keeping dining under budget!",
    body: "You spent $820 on food this month vs your $900 target. That's $80 saved — keep it up!",
    action: null,
  },
  {
    id: 4,
    type: "tip",
    icon: Globe,
    color: "#7C3AED",
    bg: "#F5F3FF",
    title: "Your Wise transfer had a 2.1% FX fee",
    body: "For regular remittances to Brazil, Remitly or Wise's guaranteed rate can save you up to $15 per $500 transfer. Over a year that adds up to $180.",
    action: "Compare rates",
  },
  {
    id: 5,
    type: "tip",
    icon: ShieldCheck,
    color: "#06B6D4",
    bg: "#ECFEFF",
    title: "Build your AU credit history faster",
    body: "As a newcomer, getting an Afterpay account and a secured credit card (e.g. Bankwest Zero) and paying them off monthly are the fastest ways to build a credit score.",
    action: "How to start",
  },
];

const goals = [
  { id: 1, label: "Emergency Fund (3 months)", target: 12600, current: 8400, color: "#7C3AED", icon: ShieldCheck },
  { id: 2, label: "Holiday — Japan 🇯🇵", target: 5000, current: 1200, color: "#F59E0B", icon: Globe },
  { id: 3, label: "New MacBook", target: 2500, current: 2100, color: "#10B981", icon: Zap },
];

const immigrantChecklist = [
  { label: "Open an Australian bank account", done: true, icon: CheckCircle2 },
  { label: "Get a Tax File Number (TFN)", done: true, icon: CheckCircle2 },
  { label: "Register for myGov + link ATO", done: true, icon: CheckCircle2 },
  { label: "Set up superannuation account", done: false, icon: CheckCircle2 },
  { label: "Get a secured credit card to build credit history", done: false, icon: CheckCircle2 },
  { label: "Take out private health insurance (optional)", done: false, icon: CheckCircle2 },
  { label: "File first Australian tax return", done: false, icon: CheckCircle2 },
];

const tabs = [
  { id: "budget", label: "50/30/20 Budget", icon: Target },
  { id: "tips", label: "Smart Tips", icon: Lightbulb },
  { id: "goals", label: "Goals", icon: TrendingUp },
  { id: "immigrant", label: "New to AU 🇦🇺", icon: Globe },
];

export default function GuidePage() {
  const [tab, setTab] = useState("budget");

  const needsPct = (budgetData.needs.actual / budgetData.income) * 100;
  const wantsPct = (budgetData.wants.actual / budgetData.income) * 100;
  const savingsPct = (budgetData.savings.actual / budgetData.income) * 100;

  return (
    <div style={{ padding: "24px", maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>
          Spending Guide
        </h1>
        <p style={{ color: "#64748B", fontSize: 14, marginTop: 2 }}>
          Personalised insights to help you spend smarter
        </p>
      </div>

      {/* Tab switcher */}
      <div
        style={{
          display: "flex",
          gap: 4,
          background: "white",
          borderRadius: 16,
          padding: 4,
          border: "1px solid #F1F5F9",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          marginBottom: 28,
          overflowX: "auto",
        }}
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 18px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              background: tab === id ? "#7C3AED" : "transparent",
              color: tab === id ? "white" : "#64748B",
              whiteSpace: "nowrap",
            }}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* 50/30/20 Budget Tab */}
      {tab === "budget" && (
        <div>
          <div
            style={{
              background: "linear-gradient(135deg, #0F172A, #1E1B4B)",
              borderRadius: 24,
              padding: "28px 32px",
              marginBottom: 24,
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 4 }}>Monthly Income</p>
            <p style={{ color: "white", fontSize: 36, fontWeight: 800, letterSpacing: "-1px", marginBottom: 20 }}>
              $4,200.00
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.5 }}>
              The 50/30/20 rule suggests splitting your income into <strong style={{ color: "white" }}>50% needs</strong>, <strong style={{ color: "white" }}>30% wants</strong>, and <strong style={{ color: "white" }}>20% savings</strong>. Here&apos;s how you&apos;re tracking:
            </p>
          </div>

          {[
            {
              label: "Needs",
              sub: "Rent, bills, groceries, transport",
              budget: budgetData.needs.budget,
              actual: budgetData.needs.actual,
              pct: needsPct,
              targetPct: 50,
              color: "#7C3AED",
              bg: "#F5F3FF",
              icons: [Home, Zap, Coffee, Car],
            },
            {
              label: "Wants",
              sub: "Dining out, entertainment, shopping",
              budget: budgetData.wants.budget,
              actual: budgetData.wants.actual,
              pct: wantsPct,
              targetPct: 30,
              color: "#F59E0B",
              bg: "#FFFBEB",
              icons: [Coffee, BookOpen],
            },
            {
              label: "Savings & Investing",
              sub: "Emergency fund, super, investments",
              budget: budgetData.savings.budget,
              actual: budgetData.savings.actual,
              pct: savingsPct,
              targetPct: 20,
              color: "#10B981",
              bg: "#ECFDF5",
              icons: [TrendingUp, ShieldCheck],
            },
          ].map((row) => {
            const over = row.actual > row.budget;
            return (
              <div
                key={row.label}
                style={{
                  background: "white",
                  borderRadius: 20,
                  padding: "22px 24px",
                  border: "1px solid #F1F5F9",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 16, color: "#0F172A" }}>{row.label}</p>
                    <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{row.sub}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 800, fontSize: 18, color: over ? "#F43F5E" : "#0F172A" }}>
                      ${row.actual.toLocaleString()}
                    </p>
                    <p style={{ fontSize: 12, color: "#94A3B8" }}>of ${row.budget.toLocaleString()} budget</p>
                  </div>
                </div>
                <div style={{ background: "#F1F5F9", borderRadius: 6, height: 8, marginBottom: 10, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min((row.actual / row.budget) * 100, 100)}%`,
                      background: over ? "#F43F5E" : row.color,
                      borderRadius: 6,
                    }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>
                    {row.pct.toFixed(1)}% of income · target {row.targetPct}%
                  </span>
                  {over ? (
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#F43F5E", display: "flex", alignItems: "center", gap: 4 }}>
                      <AlertTriangle size={12} /> ${(row.actual - row.budget).toLocaleString()} over budget
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#10B981", display: "flex", alignItems: "center", gap: 4 }}>
                      <CheckCircle2 size={12} /> ${(row.budget - row.actual).toLocaleString()} under budget
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Smart Tips Tab */}
      {tab === "tips" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {tips.map((tip) => (
            <div
              key={tip.id}
              style={{
                background: "white",
                borderRadius: 20,
                padding: "22px 24px",
                border: "1px solid #F1F5F9",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                display: "flex",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: tip.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <tip.icon size={22} color={tip.color} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 6 }}>{tip.title}</p>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, marginBottom: tip.action ? 14 : 0 }}>
                  {tip.body}
                </p>
                {tip.action && (
                  <button
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "none",
                      border: "none",
                      color: tip.color,
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {tip.action} <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Goals Tab */}
      {tab === "goals" && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
            {goals.map((goal) => {
              const pct = (goal.current / goal.target) * 100;
              return (
                <div
                  key={goal.id}
                  style={{
                    background: "white",
                    borderRadius: 20,
                    padding: "24px",
                    border: "1px solid #F1F5F9",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: `${goal.color}18`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <goal.icon size={20} color={goal.color} />
                      </div>
                      <p style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{goal.label}</p>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: goal.color }}>{Math.round(pct)}%</span>
                  </div>
                  <div style={{ background: "#F1F5F9", borderRadius: 8, height: 10, marginBottom: 10, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: goal.color,
                        borderRadius: 8,
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "#94A3B8" }}>${goal.current.toLocaleString()} saved</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
                      ${goal.target.toLocaleString()} goal
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 14,
              border: "2px dashed #E2E8F0",
              background: "white",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              color: "#7C3AED",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            + Add a new goal
          </button>
        </div>
      )}

      {/* New to AU Tab */}
      {tab === "immigrant" && (
        <div>
          <div
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
              borderRadius: 24,
              padding: "28px 32px",
              marginBottom: 24,
            }}
          >
            <p style={{ fontSize: 24, fontWeight: 800, color: "white", marginBottom: 8 }}>
              🇦🇺 New to Australia?
            </p>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 1.6 }}>
              We know starting fresh in a new country is a lot. Here&apos;s your financial checklist to get set up the right way.
            </p>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: "24px",
              border: "1px solid #F1F5F9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              marginBottom: 20,
            }}
          >
            <h3 style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", marginBottom: 16 }}>
              Your Australian Finance Checklist
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {immigrantChecklist.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderRadius: 12,
                    background: item.done ? "#ECFDF5" : "#F8FAFC",
                    border: `1px solid ${item.done ? "#A7F3D0" : "#F1F5F9"}`,
                  }}
                >
                  <CheckCircle2 size={18} color={item.done ? "#10B981" : "#CBD5E1"} />
                  <span style={{ fontSize: 14, fontWeight: item.done ? 600 : 500, color: item.done ? "#065F46" : "#64748B", textDecoration: item.done ? "line-through" : "none" }}>
                    {item.label}
                  </span>
                  {!item.done && (
                    <button
                      style={{
                        marginLeft: "auto",
                        background: "none",
                        border: "none",
                        color: "#7C3AED",
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        flexShrink: 0,
                      }}
                    >
                      Learn more <ChevronRight size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { icon: Globe, color: "#7C3AED", bg: "#F5F3FF", title: "Send money home cheaper", body: "Compare Wise, Remitly, and Western Union for your country. You could save $30+ per $500 transfer." },
              { icon: ShieldCheck, color: "#10B981", bg: "#ECFDF5", title: "How Aussie credit works", body: "No credit history from abroad transfers here. Learn how to build yours fast — starting day one." },
              { icon: TrendingUp, color: "#F59E0B", bg: "#FFFBEB", title: "Superannuation explained", body: "Your employer puts 11.5% of your salary into super. You may be able to take it home when you leave Australia." },
              { icon: BookOpen, color: "#06B6D4", bg: "#ECFEFF", title: "Tax for newcomers", body: "Understand when you become an Australian tax resident, what it means for foreign income, and EOFY tips." },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: "white",
                  borderRadius: 18,
                  padding: "20px",
                  border: "1px solid #F1F5F9",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: card.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  <card.icon size={20} color={card.color} />
                </div>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", marginBottom: 6 }}>{card.title}</p>
                <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

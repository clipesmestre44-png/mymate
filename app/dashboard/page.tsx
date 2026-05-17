"use client";
import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Bell,
  Zap,
  ShoppingCart,
  Car,
  Utensils,
  Home,
  Smartphone,
  Plane,
  Heart,
  MoreHorizontal,
  Wallet,
  Plus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAccounts, useTransactions, ACCOUNT_META, type Transaction } from "@/app/lib/store";

const CATEGORY_META: Record<string, { label: string; color: string; bg: string; Icon: React.ComponentType<{ size?: number; color?: string }> }> = {
  food:          { label: "Food & Dining",    color: "#F43F5E", bg: "#FFF1F2", Icon: Utensils },
  transport:     { label: "Transport",         color: "#7C3AED", bg: "#F5F3FF", Icon: Car },
  shopping:      { label: "Shopping",          color: "#F59E0B", bg: "#FFFBEB", Icon: ShoppingCart },
  bills:         { label: "Bills & Utilities", color: "#06B6D4", bg: "#ECFEFF", Icon: Zap },
  entertainment: { label: "Entertainment",     color: "#10B981", bg: "#ECFDF5", Icon: Smartphone },
  health:        { label: "Health",            color: "#EC4899", bg: "#FDF2F8", Icon: Heart },
  travel:        { label: "Travel",            color: "#8B5CF6", bg: "#F5F3FF", Icon: Plane },
  home:          { label: "Home & Rent",       color: "#64748B", bg: "#F8FAFC", Icon: Home },
  income:        { label: "Income",            color: "#10B981", bg: "#ECFDF5", Icon: ArrowDownLeft },
  other:         { label: "Other",             color: "#94A3B8", bg: "#F8FAFC", Icon: MoreHorizontal },
};

function fmt(n: number, currency = "AUD") {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency, maximumFractionDigits: 2 }).format(Math.abs(n));
}

function getMonthlySpending(transactions: Transaction[]) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-AU", { month: "short" });
    const amount = transactions
      .filter((t) => t.amount < 0 && t.date.startsWith(key))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return { month: label, amount };
  });
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"week" | "month" | "year">("month");
  const { data: session } = useSession();
  const { accounts } = useAccounts();
  const { transactions } = useTransactions();

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisMonthTxs = transactions.filter((t) => t.date.startsWith(monthKey));
  const income = thisMonthTxs.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const spent = thisMonthTxs.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  const recentTxs = transactions.slice(0, 5);
  const monthlyData = useMemo(() => getMonthlySpending(transactions), [transactions]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions.filter((t) => t.amount < 0).forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(totals)
      .map(([id, value]) => ({
        id,
        value,
        name: CATEGORY_META[id]?.label ?? id,
        color: CATEGORY_META[id]?.color ?? "#94A3B8",
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <p style={{ color: "#64748B", fontSize: 14, marginBottom: 2 }}>{greeting} 👋</p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>
            {session?.user?.name ?? "Loading..."}
          </h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div
            style={{
              position: "relative",
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "white",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <Bell size={18} color="#64748B" />
          </div>
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "User"}
              width={44}
              height={44}
              style={{ borderRadius: 12, objectFit: "cover", cursor: "pointer" }}
            />
          ) : (
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "linear-gradient(135deg, #7C3AED, #10B981)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 700,
                color: "white",
                cursor: "pointer",
              }}
            >
              {firstName.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Net Worth Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)",
          borderRadius: 24,
          padding: "28px 32px",
          marginBottom: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(124,58,237,0.15)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: 80,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(6,182,212,0.1)",
            pointerEvents: "none",
          }}
        />
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 8, fontWeight: 500 }}>
          Total Balance
        </p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 44, fontWeight: 800, color: "white", letterSpacing: "-1.5px" }}>
            {accounts.length === 0 ? "$0.00" : fmt(totalBalance)}
          </span>
        </div>

        {/* Sparkline */}
        {transactions.length > 0 && (
          <div style={{ height: 60, marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="amount" stroke="#A78BFA" strokeWidth={2} fill="url(#netWorthGradient)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ background: "rgba(16,185,129,0.2)", borderRadius: 8, padding: 8 }}>
              <ArrowDownLeft size={16} color="#34D399" />
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Income this month</p>
              <p style={{ color: "white", fontWeight: 700, fontSize: 16 }}>
                {income === 0 ? "$0.00" : fmt(income)}
              </p>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ background: "rgba(244,63,94,0.2)", borderRadius: 8, padding: 8 }}>
              <ArrowUpRight size={16} color="#FB7185" />
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Spent this month</p>
              <p style={{ color: "white", fontWeight: 700, fontSize: 16 }}>
                {spent === 0 ? "$0.00" : fmt(spent)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Row */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ fontWeight: 700, fontSize: 17, color: "#0F172A" }}>My Accounts</h2>
          <Link href="/dashboard/accounts" style={{ color: "#7C3AED", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            See all →
          </Link>
        </div>

        {accounts.length === 0 ? (
          <Link
            href="/dashboard/accounts"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "20px 24px",
              background: "white",
              borderRadius: 18,
              border: "2px dashed #E2E8F0",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#F5F3FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Wallet size={20} color="#7C3AED" />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>Add your first account</p>
              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>Track your bank, savings, and credit cards</p>
            </div>
            <Plus size={18} color="#7C3AED" style={{ marginLeft: "auto" }} />
          </Link>
        ) : (
          <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 4 }}>
            {accounts.map((acc) => {
              const meta = ACCOUNT_META[acc.type];
              return (
                <div
                  key={acc.id}
                  style={{
                    minWidth: 180,
                    background: meta.gradient,
                    borderRadius: 18,
                    padding: "18px 20px",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                >
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginBottom: 4 }}>{meta.label}</p>
                  <p style={{ color: "white", fontWeight: 800, fontSize: 20, marginBottom: 2 }}>
                    {fmt(acc.balance, acc.currency)}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>
                    {acc.currency} · {acc.institution}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two-column: Spending chart + Category breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Spending trend */}
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: "24px",
            border: "1px solid #F1F5F9",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>Spending Trend</h3>
            <div style={{ display: "flex", gap: 4 }}>
              {(["week", "month", "year"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    background: activeTab === tab ? "#7C3AED" : "transparent",
                    color: activeTab === tab ? "white" : "#94A3B8",
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {transactions.length === 0 ? (
            <div style={{ height: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#CBD5E1" }}>
              <TrendingUp size={32} style={{ marginBottom: 8 }} />
              <p style={{ fontSize: 13, fontWeight: 500 }}>No transactions yet</p>
            </div>
          ) : (
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "white", border: "1px solid #F1F5F9", borderRadius: 10, fontSize: 12 }}
                    formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, "Spent"]}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#7C3AED" strokeWidth={2.5} fill="url(#spendGradient)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: "24px",
            border: "1px solid #F1F5F9",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 16 }}>By Category</h3>
          {categoryTotals.length === 0 ? (
            <div style={{ height: 130, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#CBD5E1" }}>
              <ShoppingCart size={32} style={{ marginBottom: 8 }} />
              <p style={{ fontSize: 13, fontWeight: 500 }}>No spending data yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 100, height: 100, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryTotals} cx="50%" cy="50%" innerRadius={30} outerRadius={46} dataKey="value" strokeWidth={0}>
                      {categoryTotals.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                {categoryTotals.slice(0, 4).map((cat) => (
                  <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#64748B", flex: 1 }}>{cat.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>{fmt(cat.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: "24px",
          border: "1px solid #F1F5F9",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontWeight: 700, fontSize: 17, color: "#0F172A" }}>Recent Transactions</h2>
          <Link href="/dashboard/transactions" style={{ color: "#7C3AED", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            See all →
          </Link>
        </div>

        {recentTxs.length === 0 ? (
          <div style={{ padding: "32px 0", textAlign: "center" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "#F5F3FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}
            >
              <ArrowUpRight size={24} color="#7C3AED" />
            </div>
            <p style={{ fontWeight: 600, fontSize: 15, color: "#0F172A", marginBottom: 4 }}>No transactions yet</p>
            <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 16 }}>
              Start tracking your income and expenses
            </p>
            <Link
              href="/dashboard/transactions"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                background: "#7C3AED",
                borderRadius: 10,
                color: "white",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <Plus size={14} /> Add Transaction
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {recentTxs.map((tx) => {
              const cat = CATEGORY_META[tx.category] ?? CATEGORY_META.other;
              const Icon = cat.Icon;
              const dateStr = new Date(tx.date).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
              return (
                <div
                  key={tx.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 8px",
                    borderRadius: 12,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: cat.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color={cat.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{tx.name}</p>
                    <p style={{ fontSize: 12, color: "#94A3B8" }}>{cat.label} · {dateStr}</p>
                  </div>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: tx.amount > 0 ? "#10B981" : "#0F172A",
                      flexShrink: 0,
                    }}
                  >
                    {tx.amount > 0 ? "+" : "-"}{fmt(tx.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

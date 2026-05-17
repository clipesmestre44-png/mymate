"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  TrendingUp,
  TrendingDown,
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
  Coffee,
  MoreHorizontal,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const spendingData = [
  { month: "Dec", amount: 3200 },
  { month: "Jan", amount: 2800 },
  { month: "Feb", amount: 3600 },
  { month: "Mar", amount: 2900 },
  { month: "Apr", amount: 3100 },
  { month: "May", amount: 2650 },
];

const categoryData = [
  { name: "Food & Dining", value: 820, color: "#F43F5E", icon: Utensils },
  { name: "Transport", value: 480, color: "#7C3AED", icon: Car },
  { name: "Shopping", value: 640, color: "#F59E0B", icon: ShoppingCart },
  { name: "Bills", value: 920, color: "#06B6D4", icon: Zap },
  { name: "Entertainment", value: 290, color: "#10B981", icon: Smartphone },
  { name: "Others", value: 180, color: "#94A3B8", icon: MoreHorizontal },
];

const transactions = [
  { id: 1, name: "Woolworths", category: "Food & Dining", amount: -87.50, date: "Today", icon: ShoppingCart, color: "#F43F5E", bg: "#FFF1F2" },
  { id: 2, name: "Salary — Acme Corp", category: "Income", amount: 4200.00, date: "Today", icon: ArrowDownLeft, color: "#10B981", bg: "#ECFDF5" },
  { id: 3, name: "Opal Card Top-up", category: "Transport", amount: -50.00, date: "Yesterday", icon: Car, color: "#7C3AED", bg: "#F5F3FF" },
  { id: 4, name: "Netflix", category: "Entertainment", amount: -22.99, date: "Yesterday", icon: Smartphone, color: "#F59E0B", bg: "#FFFBEB" },
  { id: 5, name: "Origin Energy", category: "Bills", amount: -145.00, date: "14 May", icon: Zap, color: "#06B6D4", bg: "#ECFEFF" },
  { id: 6, name: "Brunch @ Quay", category: "Food & Dining", amount: -64.00, date: "14 May", icon: Coffee, color: "#F43F5E", bg: "#FFF1F2" },
  { id: 7, name: "Medibank", category: "Health", amount: -135.00, date: "12 May", icon: Heart, color: "#10B981", bg: "#ECFDF5" },
  { id: 8, name: "Airbnb refund", category: "Travel", amount: 210.00, date: "11 May", icon: Plane, color: "#7C3AED", bg: "#F5F3FF" },
];

const accounts = [
  { name: "Commonwealth Bank", type: "Everyday", balance: 5840.20, currency: "AUD", change: +2.4, color: "#7C3AED", gradient: "linear-gradient(135deg, #7C3AED, #5B21B6)" },
  { name: "ING Savings", type: "High-interest savings", balance: 22400.00, currency: "AUD", change: +0.9, color: "#10B981", gradient: "linear-gradient(135deg, #10B981, #059669)" },
  { name: "Wise", type: "Multi-currency", balance: 1240.00, currency: "USD", change: -1.2, color: "#F59E0B", gradient: "linear-gradient(135deg, #F59E0B, #D97706)" },
];

function fmt(n: number, currency = "AUD") {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency, maximumFractionDigits: 2 }).format(Math.abs(n));
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"week" | "month" | "year">("month");
  const { data: session } = useSession();
  const totalBalance = 5840.20 + 22400 + 1240 * 1.52;
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

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
            <span
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#F43F5E",
                border: "1.5px solid white",
              }}
            />
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
          Total Net Worth
        </p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 44, fontWeight: 800, color: "white", letterSpacing: "-1.5px" }}>
            {fmt(totalBalance)}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "rgba(16,185,129,0.15)",
              color: "#34D399",
              borderRadius: 8,
              padding: "4px 10px",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            <TrendingUp size={14} />
            +3.2%
          </div>
        </div>

        {/* Sparkline */}
        <div style={{ height: 60, marginBottom: 16 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spendingData}>
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
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Income</p>
              <p style={{ color: "white", fontWeight: 700, fontSize: 16 }}>$4,200</p>
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
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Spent</p>
              <p style={{ color: "white", fontWeight: 700, fontSize: 16 }}>$2,650</p>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Row */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ fontWeight: 700, fontSize: 17, color: "#0F172A" }}>My Accounts</h2>
          <a href="/dashboard/accounts" style={{ color: "#7C3AED", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            See all →
          </a>
        </div>
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 4 }}>
          {accounts.map((acc) => (
            <div
              key={acc.name}
              style={{
                minWidth: 180,
                background: acc.gradient,
                borderRadius: 18,
                padding: "18px 20px",
                flexShrink: 0,
                cursor: "pointer",
              }}
            >
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginBottom: 4 }}>{acc.type}</p>
              <p style={{ color: "white", fontWeight: 800, fontSize: 20, marginBottom: 2 }}>
                {fmt(acc.balance, acc.currency)}
              </p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{acc.currency} · {acc.name}</p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  marginTop: 10,
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 6,
                  padding: "3px 8px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: acc.change >= 0 ? "#D1FAE5" : "#FEE2E2",
                }}
              >
                {acc.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {acc.change >= 0 ? "+" : ""}{acc.change}%
              </div>
            </div>
          ))}
        </div>
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
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingData}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid #F1F5F9", borderRadius: 10, fontSize: 12 }}
                  formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, "Spent"]}
                />
                <Area type="monotone" dataKey="amount" stroke="#7C3AED" strokeWidth={2.5} fill="url(#spendGradient)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 100, height: 100, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={30} outerRadius={46} dataKey="value" strokeWidth={0}>
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              {categoryData.slice(0, 4).map((cat) => (
                <div key={cat.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#64748B", flex: 1 }}>{cat.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>${cat.value}</span>
                </div>
              ))}
            </div>
          </div>
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
          <a href="/dashboard/transactions" style={{ color: "#7C3AED", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            See all →
          </a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {transactions.map((tx) => (
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
                  background: tx.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <tx.icon size={18} color={tx.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{tx.name}</p>
                <p style={{ fontSize: 12, color: "#94A3B8" }}>{tx.category} · {tx.date}</p>
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
          ))}
        </div>
      </div>
    </div>
  );
}

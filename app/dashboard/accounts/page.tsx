"use client";
import { useState } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
  Banknote,
  Globe,
  CreditCard,
  PiggyBank,
} from "lucide-react";

const accounts = [
  {
    id: 1,
    name: "Commonwealth Bank",
    accountType: "Everyday Account",
    number: "**** 4821",
    balance: 5840.20,
    currency: "AUD",
    change: +2.4,
    changeAmt: +136.50,
    type: "checking",
    icon: Banknote,
    gradient: "linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)",
    lastSync: "2 min ago",
  },
  {
    id: 2,
    name: "ING Savings Maximiser",
    accountType: "High-Interest Savings",
    number: "**** 7723",
    balance: 22400.00,
    currency: "AUD",
    change: +0.9,
    changeAmt: +200.00,
    type: "savings",
    icon: PiggyBank,
    gradient: "linear-gradient(135deg, #10B981 0%, #065F46 100%)",
    lastSync: "5 min ago",
  },
  {
    id: 3,
    name: "Wise",
    accountType: "Multi-Currency Wallet",
    number: "**** 9914",
    balance: 1240.00,
    currency: "USD",
    balanceAUD: 1884.80,
    change: -1.2,
    changeAmt: -15.00,
    type: "multi-currency",
    icon: Globe,
    gradient: "linear-gradient(135deg, #F59E0B 0%, #92400E 100%)",
    lastSync: "12 min ago",
  },
  {
    id: 4,
    name: "ANZ Credit Card",
    accountType: "Rewards Black",
    number: "**** 3302",
    balance: -1250.00,
    currency: "AUD",
    change: 0,
    changeAmt: 0,
    type: "credit",
    icon: CreditCard,
    gradient: "linear-gradient(135deg, #0F172A 0%, #334155 100%)",
    limit: 10000,
    lastSync: "1 hour ago",
  },
];

const fxRates = [
  { from: "AUD", to: "BRL", rate: 3.42, change: +0.8 },
  { from: "AUD", to: "USD", rate: 0.66, change: -0.3 },
  { from: "AUD", to: "INR", rate: 55.2, change: +1.2 },
  { from: "AUD", to: "PHP", rate: 37.8, change: +0.5 },
  { from: "AUD", to: "GBP", rate: 0.51, change: -0.2 },
  { from: "AUD", to: "EUR", rate: 0.60, change: +0.1 },
];

function fmt(n: number, currency = "AUD") {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Math.abs(n));
}

export default function AccountsPage() {
  const [hidden, setHidden] = useState(false);
  const totalAUD = 5840.20 + 22400 + 1884.80 - 1250;

  return (
    <div style={{ padding: "24px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>
            My Accounts
          </h1>
          <p style={{ color: "#64748B", fontSize: 14, marginTop: 2 }}>All balances in real-time</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setHidden(!hidden)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "white",
              border: "1px solid #E2E8F0",
              borderRadius: 12,
              padding: "10px 16px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              color: "#64748B",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            {hidden ? <Eye size={16} /> : <EyeOff size={16} />}
            {hidden ? "Show" : "Hide"} balances
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#7C3AED",
              border: "none",
              borderRadius: 12,
              padding: "10px 16px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              color: "white",
              boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
            }}
          >
            <Plus size={16} /> Add Account
          </button>
        </div>
      </div>

      {/* Total net balance card */}
      <div
        style={{
          background: "linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)",
          borderRadius: 24,
          padding: "28px 32px",
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 6 }}>Total Balance (AUD equivalent)</p>
          <p style={{ fontSize: 42, fontWeight: 800, color: "white", letterSpacing: "-1px" }}>
            {hidden ? "••••••" : fmt(totalAUD)}
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <span
              style={{
                background: "rgba(16,185,129,0.15)",
                color: "#34D399",
                borderRadius: 8,
                padding: "4px 10px",
                fontSize: 12,
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <TrendingUp size={12} /> +$320.50 this month
            </span>
          </div>
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            padding: "10px 16px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <RefreshCw size={14} /> Sync all
        </button>
      </div>

      {/* Account Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, marginBottom: 32 }}>
        {accounts.map((acc) => (
          <div
            key={acc.id}
            style={{
              background: acc.gradient,
              borderRadius: 22,
              padding: "22px 24px",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginBottom: 2 }}>{acc.accountType}</p>
                <p style={{ color: "white", fontWeight: 700, fontSize: 15 }}>{acc.name}</p>
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <acc.icon size={18} color="white" />
              </div>
            </div>

            <p style={{ fontSize: 28, fontWeight: 800, color: "white", letterSpacing: "-0.5px", marginBottom: 2 }}>
              {hidden
                ? "••••••"
                : `${acc.balance < 0 ? "-" : ""}${fmt(acc.balance, acc.currency)}`}
            </p>

            {acc.balanceAUD && !hidden && (
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginBottom: 0 }}>
                ≈ {fmt(acc.balanceAUD)} AUD
              </p>
            )}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                {acc.number} · Synced {acc.lastSync}
              </span>
              {acc.type === "credit" ? (
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>
                  Limit {fmt(acc.limit!, acc.currency)}
                </span>
              ) : acc.change !== 0 ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: 6,
                    padding: "3px 8px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: acc.change >= 0 ? "#D1FAE5" : "#FEE2E2",
                  }}
                >
                  {acc.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {acc.change >= 0 ? "+" : ""}{acc.change}% this week
                </span>
              ) : null}
            </div>

            {acc.type === "credit" && acc.limit && (
              <div style={{ marginTop: 12 }}>
                <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 4, height: 4 }}>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: 4,
                      height: "100%",
                      width: `${(Math.abs(acc.balance) / acc.limit) * 100}%`,
                    }}
                  />
                </div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 4 }}>
                  {Math.round((Math.abs(acc.balance) / acc.limit) * 100)}% used
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Add account card */}
        <div
          style={{
            borderRadius: 22,
            padding: "22px 24px",
            cursor: "pointer",
            border: "2px dashed #E2E8F0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            minHeight: 180,
            background: "white",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "#F5F3FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={22} color="#7C3AED" />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontWeight: 700, color: "#0F172A", fontSize: 15 }}>Add Account</p>
            <p style={{ color: "#94A3B8", fontSize: 12, marginTop: 4 }}>Connect via Open Banking</p>
          </div>
        </div>
      </div>

      {/* FX Rates */}
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
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 17, color: "#0F172A" }}>Live FX Rates</h2>
            <p style={{ color: "#94A3B8", fontSize: 12, marginTop: 2 }}>Updated every 15 minutes</p>
          </div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: 10,
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 12,
              color: "#64748B",
            }}
          >
            <ExternalLink size={13} /> Set alert
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          {fxRates.map((fx) => (
            <div
              key={fx.to}
              style={{
                background: "#F8FAFC",
                borderRadius: 14,
                padding: "14px 16px",
                border: "1px solid #F1F5F9",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>
                  {fx.from}/{fx.to}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: fx.change >= 0 ? "#10B981" : "#F43F5E",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {fx.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {fx.change >= 0 ? "+" : ""}{fx.change}%
                </span>
              </div>
              <p style={{ fontWeight: 800, fontSize: 20, color: "#0F172A" }}>{fx.rate}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

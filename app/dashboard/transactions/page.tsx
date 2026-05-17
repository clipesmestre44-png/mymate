"use client";
import { useState } from "react";
import {
  Search,
  Filter,
  ShoppingCart,
  Car,
  Utensils,
  Zap,
  Smartphone,
  Home,
  Heart,
  Plane,
  Coffee,
  ArrowDownLeft,
  MoreHorizontal,
  ChevronDown,
  TrendingDown,
} from "lucide-react";

const categories = [
  { id: "all", label: "All", color: "#64748B", bg: "#F8FAFC" },
  { id: "food", label: "Food & Dining", color: "#F43F5E", bg: "#FFF1F2", icon: Utensils },
  { id: "transport", label: "Transport", color: "#7C3AED", bg: "#F5F3FF", icon: Car },
  { id: "shopping", label: "Shopping", color: "#F59E0B", bg: "#FFFBEB", icon: ShoppingCart },
  { id: "bills", label: "Bills & Utilities", color: "#06B6D4", bg: "#ECFEFF", icon: Zap },
  { id: "entertainment", label: "Entertainment", color: "#10B981", bg: "#ECFDF5", icon: Smartphone },
  { id: "health", label: "Health", color: "#EC4899", bg: "#FDF2F8", icon: Heart },
  { id: "travel", label: "Travel", color: "#8B5CF6", bg: "#F5F3FF", icon: Plane },
  { id: "home", label: "Home", color: "#64748B", bg: "#F8FAFC", icon: Home },
  { id: "income", label: "Income", color: "#10B981", bg: "#ECFDF5", icon: ArrowDownLeft },
];

const transactions = [
  { id: 1, name: "Woolworths", category: "shopping", amount: -87.50, date: "17 May 2026", icon: ShoppingCart, color: "#F43F5E", bg: "#FFF1F2", account: "CommBank", tags: ["Groceries"] },
  { id: 2, name: "Salary — Acme Corp", category: "income", amount: 4200.00, date: "17 May 2026", icon: ArrowDownLeft, color: "#10B981", bg: "#ECFDF5", account: "CommBank", tags: ["Income"] },
  { id: 3, name: "Opal Card Top-up", category: "transport", amount: -50.00, date: "16 May 2026", icon: Car, color: "#7C3AED", bg: "#F5F3FF", account: "CommBank", tags: ["Public transport"] },
  { id: 4, name: "Netflix", category: "entertainment", amount: -22.99, date: "16 May 2026", icon: Smartphone, color: "#F59E0B", bg: "#FFFBEB", account: "ANZ Card", tags: ["Subscription"] },
  { id: 5, name: "Origin Energy", category: "bills", amount: -145.00, date: "14 May 2026", icon: Zap, color: "#06B6D4", bg: "#ECFEFF", account: "CommBank", tags: ["Electricity"] },
  { id: 6, name: "Brunch @ Quay Restaurant", category: "food", amount: -64.00, date: "14 May 2026", icon: Coffee, color: "#F43F5E", bg: "#FFF1F2", account: "ANZ Card", tags: ["Dining out"] },
  { id: 7, name: "Medibank Private", category: "health", amount: -135.00, date: "12 May 2026", icon: Heart, color: "#EC4899", bg: "#FDF2F8", account: "CommBank", tags: ["Insurance"] },
  { id: 8, name: "Airbnb refund", category: "travel", amount: 210.00, date: "11 May 2026", icon: Plane, color: "#8B5CF6", bg: "#F5F3FF", account: "ANZ Card", tags: ["Travel"] },
  { id: 9, name: "Kmart", category: "shopping", amount: -43.20, date: "11 May 2026", icon: ShoppingCart, color: "#F43F5E", bg: "#FFF1F2", account: "ANZ Card", tags: ["Clothing"] },
  { id: 10, name: "Coles", category: "shopping", amount: -68.40, date: "10 May 2026", icon: ShoppingCart, color: "#F59E0B", bg: "#FFFBEB", account: "CommBank", tags: ["Groceries"] },
  { id: 11, name: "Rent — 42 George St", category: "home", amount: -1800.00, date: "10 May 2026", icon: Home, color: "#64748B", bg: "#F8FAFC", account: "CommBank", tags: ["Rent"] },
  { id: 12, name: "Uber Eats", category: "food", amount: -32.50, date: "9 May 2026", icon: Utensils, color: "#F43F5E", bg: "#FFF1F2", account: "ANZ Card", tags: ["Delivery"] },
  { id: 13, name: "Spotify", category: "entertainment", amount: -11.99, date: "8 May 2026", icon: Smartphone, color: "#10B981", bg: "#ECFDF5", account: "ANZ Card", tags: ["Subscription"] },
  { id: 14, name: "Wise — Transfer to BRL", category: "transport", amount: -500.00, date: "7 May 2026", icon: MoreHorizontal, color: "#F59E0B", bg: "#FFFBEB", account: "Wise", tags: ["Remittance"] },
];

function fmt(n: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 2 }).format(Math.abs(n));
}

const categorySpend: Record<string, number> = {};
transactions.filter(t => t.amount < 0).forEach(t => {
  categorySpend[t.category] = (categorySpend[t.category] || 0) + Math.abs(t.amount);
});
const totalSpent = Object.values(categorySpend).reduce((a, b) => a + b, 0);

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = transactions.filter((tx) => {
    const matchSearch = tx.name.toLowerCase().includes(search.toLowerCase()) || tx.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === "all" || tx.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ padding: "24px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>
          Transactions
        </h1>
        <p style={{ color: "#64748B", fontSize: 14, marginTop: 2 }}>May 2026 · {transactions.length} transactions</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Total Spent", value: fmt(totalSpent), icon: TrendingDown, color: "#F43F5E", bg: "#FFF1F2" },
          { label: "Total Income", value: "$4,200.00", icon: ArrowDownLeft, color: "#10B981", bg: "#ECFDF5" },
          { label: "Net Cash Flow", value: "+$1,550.00", icon: ArrowDownLeft, color: "#7C3AED", bg: "#F5F3FF" },
          { label: "Transactions", value: `${transactions.length}`, icon: MoreHorizontal, color: "#06B6D4", bg: "#ECFEFF" },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: "white",
              borderRadius: 16,
              padding: "18px 20px",
              border: "1px solid #F1F5F9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex",
              alignItems: "center",
              gap: 14,
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
                flexShrink: 0,
              }}
            >
              <card.icon size={20} color={card.color} />
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>{card.label}</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category breakdown bar */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: "20px 24px",
          border: "1px solid #F1F5F9",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          marginBottom: 24,
        }}
      >
        <h3 style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", marginBottom: 14 }}>Spending by Category</h3>
        <div style={{ display: "flex", height: 10, borderRadius: 6, overflow: "hidden", marginBottom: 14 }}>
          {categories.filter(c => c.id !== "all" && c.id !== "income" && categorySpend[c.id]).map((cat) => (
            <div
              key={cat.id}
              style={{
                flex: categorySpend[cat.id] / totalSpent,
                background: cat.color,
                minWidth: 4,
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {categories.filter(c => c.id !== "all" && c.id !== "income" && categorySpend[c.id]).map((cat) => (
            <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color }} />
              <span style={{ fontSize: 12, color: "#64748B" }}>{cat.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>{fmt(categorySpend[cat.id])}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search + filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div
          style={{
            flex: 1,
            minWidth: 200,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "white",
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            padding: "10px 16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <Search size={16} color="#94A3B8" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 14,
              color: "#0F172A",
              background: "transparent",
            }}
          />
        </div>
        <button
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
          <Filter size={14} /> Filter <ChevronDown size={14} />
        </button>
      </div>

      {/* Category chips */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20 }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 100,
              border: activeCategory === cat.id ? `2px solid ${cat.color}` : "1px solid #E2E8F0",
              background: activeCategory === cat.id ? cat.bg : "white",
              color: activeCategory === cat.id ? cat.color : "#64748B",
              fontWeight: activeCategory === cat.id ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {cat.icon && <cat.icon size={13} />}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Transaction list */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          border: "1px solid #F1F5F9",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "#94A3B8" }}>
            <Search size={32} style={{ margin: "0 auto 12px", display: "block" }} />
            <p style={{ fontWeight: 600 }}>No transactions found</p>
          </div>
        ) : (
          filtered.map((tx, i) => (
            <div
              key={tx.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 20px",
                borderBottom: i < filtered.length - 1 ? "1px solid #F8FAFC" : "none",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: tx.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <tx.icon size={19} color={tx.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{tx.name}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>{tx.date}</span>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#CBD5E1", display: "inline-block" }} />
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>{tx.account}</span>
                  {tx.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: tx.color,
                        background: tx.bg,
                        borderRadius: 5,
                        padding: "1px 7px",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
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
          ))
        )}
      </div>
    </div>
  );
}

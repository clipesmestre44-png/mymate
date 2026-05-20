"use client";
import { useState, useMemo } from "react";
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
  ArrowDownLeft,
  MoreHorizontal,
  ChevronDown,
  TrendingDown,
  Plus,
  X,
  Tag,
} from "lucide-react";
import { useTransactions, useAccounts, type Transaction } from "@/app/lib/store";

import type React from "react";

type CatDef = { id: string; label: string; color: string; bg: string; Icon: React.ComponentType<{ size?: number; color?: string }> };

const CATEGORIES: CatDef[] = [
  { id: "food",          label: "Food & Dining",    color: "#F43F5E", bg: "#FFF1F2", Icon: Utensils },
  { id: "transport",     label: "Transport",         color: "#7C3AED", bg: "#F5F3FF", Icon: Car },
  { id: "shopping",      label: "Shopping",          color: "#F59E0B", bg: "#FFFBEB", Icon: ShoppingCart },
  { id: "bills",         label: "Bills & Utilities", color: "#06B6D4", bg: "#ECFEFF", Icon: Zap },
  { id: "entertainment", label: "Entertainment",     color: "#10B981", bg: "#ECFDF5", Icon: Smartphone },
  { id: "health",        label: "Health",            color: "#EC4899", bg: "#FDF2F8", Icon: Heart },
  { id: "travel",        label: "Travel",            color: "#8B5CF6", bg: "#F5F3FF", Icon: Plane },
  { id: "home",          label: "Home & Rent",       color: "#64748B", bg: "#F8FAFC", Icon: Home },
  { id: "income",        label: "Income",            color: "#10B981", bg: "#ECFDF5", Icon: ArrowDownLeft },
  { id: "other",         label: "Other",             color: "#94A3B8", bg: "#F8FAFC", Icon: MoreHorizontal },
];

const CAT_ALL: { id: string; label: string; color: string; bg: string } = { id: "all", label: "All", color: "#64748B", bg: "#F8FAFC" };
const CAT_MAP: Record<string, CatDef> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

function fmt(n: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 2 }).format(Math.abs(n));
}

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function AddTransactionModal({
  onClose,
  onSave,
  accountOptions,
}: {
  onClose: () => void;
  onSave: (data: Omit<Transaction, "id">) => void;
  accountOptions: { id: string; name: string; institution: string }[];
}) {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [accountId, setAccountId] = useState(accountOptions[0]?.id ?? "");
  const [date, setDate] = useState(today());
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) { setError("Please enter a name."); return; }
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) { setError("Please enter a valid amount."); return; }
    if (!accountId) { setError("Please select an account."); return; }
    const finalAmount = type === "income" ? val : -val;
    const finalCategory = type === "income" ? "income" : category;
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    onSave({ name: name.trim(), amount: finalAmount, category: finalCategory, accountId, date, tags });
    onClose();
  };

  const inputStyle = {
    width: "100%",
    border: "1.5px solid #E2E8F0",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 14,
    color: "#0F172A",
    background: "white",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: "#64748B",
    display: "block",
    marginBottom: 6,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(0,0,0,0.4)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: "24px 24px 0 0",
          padding: "28px 24px 40px",
          width: "100%",
          maxWidth: 520,
          boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "#E2E8F0", margin: "0 auto 20px" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>Add Transaction</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
            <X size={20} />
          </button>
        </div>

        {/* Type toggle */}
        <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setType(t); if (t === "income") setCategory("income"); }}
              style={{
                flex: 1,
                padding: "9px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 14,
                background: type === t ? "white" : "transparent",
                color: type === t ? (t === "expense" ? "#F43F5E" : "#10B981") : "#94A3B8",
                boxShadow: type === t ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {t === "expense" ? "Expense" : "Income"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Description</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Woolworths, Salary..."
              style={inputStyle}
            />
          </div>

          {/* Amount */}
          <div>
            <label style={labelStyle}>Amount (AUD)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={inputStyle}
            />
          </div>

          {/* Category — hidden when income */}
          {type === "expense" && (
            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={inputStyle}
              >
                {CATEGORIES.filter((c) => c.id !== "income").map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Account */}
          {accountOptions.length > 0 && (
            <div>
              <label style={labelStyle}>Account</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                style={inputStyle}
              >
                {accountOptions.map((a) => (
                  <option key={a.id} value={a.id}>{a.institution} — {a.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Date */}
          <div>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Tags */}
          <div>
            <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 4 }}>
              <Tag size={12} /> Tags <span style={{ fontWeight: 400 }}>(optional, comma-separated)</span>
            </label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Groceries, Weekly"
              style={inputStyle}
            />
          </div>
        </div>

        {error && (
          <p style={{ color: "#F43F5E", fontSize: 13, marginTop: 12, fontWeight: 500 }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            marginTop: 24,
            padding: "14px",
            background: type === "income"
              ? "linear-gradient(135deg, #10B981, #065F46)"
              : "linear-gradient(135deg, #7C3AED, #4C1D95)",
            borderRadius: 14,
            border: "none",
            color: "white",
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Save Transaction
        </button>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const { transactions, addTransaction } = useTransactions();
  const { accounts, updateBalance } = useAccounts();

  // Wrapper: add transaction + immediately update the linked account balance
  const handleAddTransaction = (data: Omit<Transaction, "id">) => {
    addTransaction(data);
    if (data.accountId) {
      const acc = accounts.find((a) => a.id === data.accountId);
      if (acc) updateBalance(data.accountId, acc.balance + data.amount);
    }
  };

  const accountOptions = accounts.map((a) => ({ id: a.id, name: a.name, institution: a.institution }));
  const accountMap = Object.fromEntries(accounts.map((a) => [a.id, a]));

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        tx.name.toLowerCase().includes(q) ||
        tx.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = activeCategory === "all" || tx.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [transactions, search, activeCategory]);

  const totalSpent = useMemo(
    () => transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0),
    [transactions],
  );
  const totalIncome = useMemo(
    () => transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0),
    [transactions],
  );
  const netFlow = totalIncome - totalSpent;

  const categorySpend = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions.filter((t) => t.amount < 0).forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + Math.abs(t.amount);
    });
    return totals;
  }, [transactions]);

  const spendCategories = CATEGORIES.filter((c) => c.id !== "income" && categorySpend[c.id]);

  return (
    <div style={{ padding: "24px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>
            Transactions
          </h1>
          <p style={{ color: "#64748B", fontSize: 14, marginTop: 2 }}>
            {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 20px",
            background: "linear-gradient(135deg, #7C3AED, #4C1D95)",
            borderRadius: 12,
            border: "none",
            color: "white",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
          }}
        >
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Total Spent", value: fmt(totalSpent), Icon: TrendingDown, color: "#F43F5E", bg: "#FFF1F2" },
          { label: "Total Income", value: fmt(totalIncome), Icon: ArrowDownLeft, color: "#10B981", bg: "#ECFDF5" },
          { label: "Net Cash Flow", value: (netFlow >= 0 ? "+" : "-") + fmt(netFlow), Icon: ArrowDownLeft, color: "#7C3AED", bg: "#F5F3FF" },
          { label: "Transactions", value: `${transactions.length}`, Icon: MoreHorizontal, color: "#06B6D4", bg: "#ECFEFF" },
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
              <card.Icon size={20} color={card.color} />
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>{card.label}</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category breakdown bar — only if data exists */}
      {spendCategories.length > 0 && (
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
            {spendCategories.map((cat) => (
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
            {spendCategories.map((cat) => (
              <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color }} />
                <span style={{ fontSize: 12, color: "#64748B" }}>{cat.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>{fmt(categorySpend[cat.id])}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
        {[CAT_ALL, ...CATEGORIES].map((cat) => {
          const active = activeCategory === cat.id;
          const def = CATEGORIES.find((c) => c.id === cat.id);
          const ChipIcon = def?.Icon;
          return (
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
                border: active ? `2px solid ${cat.color}` : "1px solid #E2E8F0",
                background: active ? cat.bg : "white",
                color: active ? cat.color : "#64748B",
                fontWeight: active ? 700 : 500,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {ChipIcon && <ChipIcon size={13} />}
              {cat.label}
            </button>
          );
        })}
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
        {transactions.length === 0 ? (
          <div style={{ padding: "56px 24px", textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "#F5F3FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <ArrowDownLeft size={28} color="#7C3AED" />
            </div>
            <p style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", marginBottom: 6 }}>
              No transactions yet
            </p>
            <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>
              Record your first income or expense
            </p>
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "11px 22px",
                background: "linear-gradient(135deg, #7C3AED, #4C1D95)",
                borderRadius: 12,
                border: "none",
                color: "white",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              <Plus size={15} /> Add Transaction
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "#94A3B8" }}>
            <Search size={32} style={{ margin: "0 auto 12px", display: "block" }} />
            <p style={{ fontWeight: 600 }}>No transactions found</p>
          </div>
        ) : (
          filtered.map((tx, i) => {
            const cat = CAT_MAP[tx.category] ?? CAT_MAP.other;
            const Icon = cat.Icon;
            const acc = accountMap[tx.accountId];
            const dateStr = new Date(tx.date).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
            return (
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
                    background: cat.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={19} color={cat.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{tx.name}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "#94A3B8" }}>{dateStr}</span>
                    {acc && (
                      <>
                        <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#CBD5E1", display: "inline-block" }} />
                        <span style={{ fontSize: 12, color: "#94A3B8" }}>{acc.institution}</span>
                      </>
                    )}
                    {tx.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: cat.color,
                          background: cat.bg,
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
            );
          })
        )}
      </div>

      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSave={handleAddTransaction}
          accountOptions={accountOptions}
        />
      )}
    </div>
  );
}

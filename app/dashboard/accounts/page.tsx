"use client";
import { useState } from "react";
import {
  Plus, Eye, EyeOff, RefreshCw, TrendingUp, TrendingDown,
  Banknote, Globe, CreditCard, PiggyBank, BarChart2,
  X, Check, Trash2,
} from "lucide-react";
import { useAccounts, ACCOUNT_META, type AccountType, type Currency } from "@/app/lib/store";

const fxRates = [
  { from: "AUD", to: "BRL", rate: 3.42, change: +0.8 },
  { from: "AUD", to: "USD", rate: 0.66, change: -0.3 },
  { from: "AUD", to: "INR", rate: 55.2, change: +1.2 },
  { from: "AUD", to: "PHP", rate: 37.8, change: +0.5 },
  { from: "AUD", to: "GBP", rate: 0.51, change: -0.2 },
  { from: "AUD", to: "EUR", rate: 0.60, change: +0.1 },
];

const TYPE_ICONS: Record<AccountType, React.ElementType> = {
  everyday: Banknote,
  savings: PiggyBank,
  credit: CreditCard,
  investment: BarChart2,
  multi: Globe,
};

const CURRENCIES: Currency[] = ["AUD", "USD", "BRL", "GBP", "EUR", "INR", "NZD", "PHP"];
const ACCOUNT_TYPES: AccountType[] = ["everyday", "savings", "credit", "investment", "multi"];

function fmt(n: number, currency = "AUD") {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency, maximumFractionDigits: 2 }).format(Math.abs(n));
}

function AddAccountModal({ onClose }: { onClose: () => void }) {
  const { addAccount } = useAccounts();
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [type, setType] = useState<AccountType>("everyday");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState<Currency>("AUD");
  const [number, setNumber] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    setSaving(true);
    addAccount({
      name: name.trim(),
      institution: institution.trim() || name.trim(),
      type,
      balance: parseFloat(balance) || 0,
      currency,
      number: number.trim() ? `**** ${number.trim().slice(-4)}` : "**** ????",
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "white", borderRadius: 24, padding: 32,
          width: "100%", maxWidth: 480,
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontWeight: 800, fontSize: 20, color: "#0F172A" }}>Add Account</h2>
          <button onClick={onClose} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: 8, cursor: "pointer", display: "flex" }}>
            <X size={18} color="#64748B" />
          </button>
        </div>

        {/* Account type */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 10 }}>
            Account Type
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ACCOUNT_TYPES.map((t) => {
              const meta = ACCOUNT_META[t];
              const Icon = TYPE_ICONS[t];
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 10, cursor: "pointer",
                    border: type === t ? `2px solid ${meta.color}` : "1px solid #E2E8F0",
                    background: type === t ? meta.bg : "white",
                    color: type === t ? meta.color : "#64748B",
                    fontWeight: type === t ? 700 : 500, fontSize: 13,
                  }}
                >
                  <Icon size={14} /> {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Name */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
            Account Name *
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Commonwealth Bank"
            style={{
              width: "100%", padding: "12px 16px", borderRadius: 12,
              border: "1.5px solid #E2E8F0", fontSize: 15, color: "#0F172A",
              outline: "none", background: "white",
            }}
          />
        </div>

        {/* Balance + Currency */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
              Current Balance
            </label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="0.00"
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12,
                border: "1.5px solid #E2E8F0", fontSize: 15, color: "#0F172A",
                outline: "none", background: "white",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12,
                border: "1.5px solid #E2E8F0", fontSize: 15, color: "#0F172A",
                outline: "none", background: "white", cursor: "pointer",
              }}
            >
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Account number */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
            Last 4 digits (optional)
          </label>
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="e.g. 4821"
            maxLength={4}
            style={{
              width: "100%", padding: "12px 16px", borderRadius: 12,
              border: "1.5px solid #E2E8F0", fontSize: 15, color: "#0F172A",
              outline: "none", background: "white",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "14px", borderRadius: 12,
              border: "1px solid #E2E8F0", background: "white",
              color: "#64748B", fontWeight: 600, fontSize: 15, cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            style={{
              flex: 2, padding: "14px", borderRadius: 12, border: "none",
              background: name.trim() ? "linear-gradient(135deg, #7C3AED, #6D28D9)" : "#E2E8F0",
              color: name.trim() ? "white" : "#94A3B8",
              fontWeight: 700, fontSize: 15, cursor: name.trim() ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: name.trim() ? "0 4px 14px rgba(124,58,237,0.3)" : "none",
            }}
          >
            <Check size={17} /> Add Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AccountsPage() {
  const { accounts, deleteAccount } = useAccounts();
  const [hidden, setHidden] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const totalAUD = accounts.reduce((sum, acc) => {
    if (acc.type === "credit") return sum - Math.abs(acc.balance);
    return sum + acc.balance;
  }, 0);

  return (
    <div style={{ padding: "24px", maxWidth: 1000, margin: "0 auto" }}>
      {showModal && <AddAccountModal onClose={() => setShowModal(false)} />}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>My Accounts</h1>
          <p style={{ color: "#64748B", fontSize: 14, marginTop: 2 }}>
            {accounts.length === 0 ? "Add your first account to get started" : `${accounts.length} account${accounts.length !== 1 ? "s" : ""} connected`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setHidden(!hidden)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "white", border: "1px solid #E2E8F0", borderRadius: 12,
              padding: "10px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#64748B",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            {hidden ? <Eye size={16} /> : <EyeOff size={16} />}
            {hidden ? "Show" : "Hide"}
          </button>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#7C3AED", border: "none", borderRadius: 12,
              padding: "10px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "white",
              boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
            }}
          >
            <Plus size={16} /> Add Account
          </button>
        </div>
      </div>

      {/* Total balance */}
      {accounts.length > 0 && (
        <div
          style={{
            background: "linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)",
            borderRadius: 24, padding: "28px 32px", marginBottom: 28,
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20,
          }}
        >
          <div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 6 }}>Total Net Balance</p>
            <p style={{ fontSize: 42, fontWeight: 800, color: "white", letterSpacing: "-1px" }}>
              {hidden ? "••••••" : fmt(totalAUD)}
            </p>
          </div>
          <button
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12, padding: "10px 16px", cursor: "pointer",
              fontWeight: 600, fontSize: 13, color: "rgba(255,255,255,0.7)",
            }}
          >
            <RefreshCw size={14} /> Sync all
          </button>
        </div>
      )}

      {/* Account cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18, marginBottom: 32 }}>
        {accounts.map((acc) => {
          const meta = ACCOUNT_META[acc.type];
          const Icon = TYPE_ICONS[acc.type];
          return (
            <div
              key={acc.id}
              style={{
                background: meta.gradient, borderRadius: 22, padding: "22px 24px",
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginBottom: 2 }}>{meta.label}</p>
                  <p style={{ color: "white", fontWeight: 700, fontSize: 15 }}>{acc.name}</p>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color="white" />
                  </div>
                  <button
                    onClick={() => deleteAccount(acc.id)}
                    style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: 8, cursor: "pointer", display: "flex" }}
                  >
                    <Trash2 size={15} color="rgba(255,255,255,0.7)" />
                  </button>
                </div>
              </div>
              <p style={{ fontSize: 28, fontWeight: 800, color: "white", letterSpacing: "-0.5px", marginBottom: 2 }}>
                {hidden ? "••••••" : `${acc.balance < 0 ? "-" : ""}${fmt(acc.balance, acc.currency)}`}
              </p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4 }}>
                {acc.number} · {acc.currency}
              </p>
              {acc.type === "credit" && acc.balance !== 0 && (
                <div style={{ marginTop: 12, background: "rgba(255,255,255,0.1)", borderRadius: 4, height: 4 }}>
                  <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 4, height: "100%", width: "12%" }} />
                </div>
              )}
            </div>
          );
        })}

        {/* Add account placeholder */}
        <div
          onClick={() => setShowModal(true)}
          style={{
            borderRadius: 22, padding: "22px 24px", cursor: "pointer",
            border: "2px dashed #E2E8F0", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 12, minHeight: 160,
            background: "white",
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus size={22} color="#7C3AED" />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontWeight: 700, color: "#0F172A", fontSize: 15 }}>Add Account</p>
            <p style={{ color: "#94A3B8", fontSize: 12, marginTop: 4 }}>Manually track any account</p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {accounts.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 24px", color: "#94A3B8" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏦</div>
          <p style={{ fontWeight: 700, fontSize: 18, color: "#0F172A", marginBottom: 8 }}>No accounts yet</p>
          <p style={{ fontSize: 14, marginBottom: 24 }}>Add your bank accounts to start tracking your money</p>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "#7C3AED", color: "white", border: "none", borderRadius: 12,
              padding: "14px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}
          >
            <Plus size={18} /> Add First Account
          </button>
        </div>
      )}

      {/* FX Rates */}
      <div style={{ background: "white", borderRadius: 20, padding: "24px", border: "1px solid #F1F5F9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 17, color: "#0F172A" }}>Live FX Rates</h2>
            <p style={{ color: "#94A3B8", fontSize: 12, marginTop: 2 }}>Updated every 15 minutes</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
          {fxRates.map((fx) => (
            <div key={fx.to} style={{ background: "#F8FAFC", borderRadius: 14, padding: "14px 16px", border: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>{fx.from}/{fx.to}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: fx.change >= 0 ? "#10B981" : "#F43F5E", display: "flex", alignItems: "center", gap: 2 }}>
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

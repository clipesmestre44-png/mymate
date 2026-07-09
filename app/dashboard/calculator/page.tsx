"use client";
import { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  Calculator,
  DollarSign,
  Calendar,
  Percent,
  Info,
  Clock,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Landmark,
  Shield,
  Home,
  CalendarDays,
  CalendarCheck,
  CalendarRange,
  BarChart3,
  Sprout,
  Leaf,
  TreePine,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { useAccounts } from "@/app/lib/store";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ── Types & constants ─────────────────────────────────────────────────────────
type InvestmentType = "etf" | "savings" | "super" | "property";
type CalcTab = "investment" | "pay";

const investmentTypes: { id: InvestmentType; label: string; icon: LucideIcon; defaultRate: number; description: string }[] = [
  { id: "etf",      label: "ETF / Shares",          icon: TrendingUp, defaultRate: 9.5, description: "Average ASX 200 historical return" },
  { id: "savings",  label: "High-Interest Savings",  icon: Landmark,   defaultRate: 5.5, description: "ING Savings Maximiser current rate" },
  { id: "super",    label: "Superannuation",         icon: Shield,     defaultRate: 8.5, description: "Balanced fund average return" },
  { id: "property", label: "Property",               icon: Home,       defaultRate: 6.8, description: "Average Australian property growth" },
];

// ── Australian tax helpers (2024-25) ─────────────────────────────────────────
function calcIncomeTax(annual: number): number {
  if (annual <= 18200)  return 0;
  if (annual <= 45000)  return (annual - 18200) * 0.19;
  if (annual <= 135000) return 5092  + (annual - 45000)  * 0.325;
  if (annual <= 190000) return 31288 + (annual - 135000) * 0.37;
  return 51638 + (annual - 190000) * 0.45;
}

function calcLITO(annual: number): number {
  if (annual <= 37500) return 700;
  if (annual <= 45000) return 700 - (annual - 37500) * 0.05;
  if (annual <= 66667) return 325 - (annual - 45000) * 0.015;
  return 0;
}

function calcMedicare(annual: number): number {
  if (annual <= 26000) return 0;
  if (annual <= 32500) return (annual - 26000) * 0.1; // phase-in
  return annual * 0.02;
}

function calcNetAnnual(grossAnnual: number) {
  const tax      = Math.max(0, calcIncomeTax(grossAnnual) - calcLITO(grossAnnual));
  const medicare = calcMedicare(grossAnnual);
  return { tax, medicare, net: grossAnnual - tax - medicare };
}

// ── Formatters ────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtFull(n: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
}

function fmtDec(n: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 2 }).format(n);
}

// ── Pay Calculator ────────────────────────────────────────────────────────────
function PayCalculator() {
  const [hours,    setHours]    = useState(38);
  const [rate,     setRate]     = useState("");
  const [showTax,  setShowTax]  = useState(false);

  const hrRate   = parseFloat(rate) || 0;
  const overtime = Math.max(0, hours - 38);
  const normalHrs = Math.min(hours, 38);

  // AU overtime: 1.5× first 2 extra hours, 2× after (common award rate)
  const overtimePay = overtime <= 2
    ? overtime * hrRate * 1.5
    : (2 * hrRate * 1.5) + ((overtime - 2) * hrRate * 2);

  const grossWeekly     = normalHrs * hrRate + overtimePay;
  const grossFortnightly = grossWeekly * 2;
  const grossMonthly    = grossWeekly * (52 / 12);
  const grossAnnual     = grossWeekly * 52;

  const superWeekly     = grossWeekly * 0.115;
  const superAnnual     = grossAnnual * 0.115;

  const { tax, medicare, net: netAnnual } = useMemo(() => calcNetAnnual(grossAnnual), [grossAnnual]);
  const netWeekly    = netAnnual / 52;
  const netMonthly   = netAnnual / 12;
  const effectiveRate = grossAnnual > 0 ? ((tax + medicare) / grossAnnual) * 100 : 0;

  const inputStyle = {
    border: "1.5px solid #E2E8F0",
    borderRadius: 12,
    padding: "12px 16px",
    fontSize: 16,
    fontWeight: 700,
    color: "#0F172A",
    outline: "none",
    background: "white",
    width: "100%",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24, alignItems: "start" }}>
      {/* ── Inputs ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ background: "white", borderRadius: 20, padding: "22px", border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <p style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", marginBottom: 20 }}>Your Work Details</p>

          {/* Hours */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Clock size={15} color="#7C3AED" />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}>Hours worked this week</span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>{hours} hrs</span>
            </div>
            <input
              type="range"
              min={1} max={80} step={0.5}
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value))}
              style={{ width: "100%", height: 6, accentColor: "#7C3AED", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 10, color: "#CBD5E1" }}>1</span>
              <span style={{ fontSize: 10, color: "#7C3AED", fontWeight: 600 }}>38 standard</span>
              <span style={{ fontSize: 10, color: "#CBD5E1" }}>80</span>
            </div>
            {overtime > 0 && (
              <div style={{ marginTop: 10, background: "#FFF7ED", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#92400E", fontWeight: 500 }}>
                ⏰ {overtime.toFixed(1)} hrs overtime — 1.5× for first 2 hrs, 2× after
              </div>
            )}
          </div>

          {/* Hourly rate */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <DollarSign size={15} color="#7C3AED" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}>Hourly rate (AUD)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#94A3B8" }}>$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="0.00"
                style={inputStyle}
              />
              <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 600, whiteSpace: "nowrap" }}>/hr</span>
            </div>
            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 8 }}>
              AU minimum wage: $24.10/hr (July 2024)
            </p>
          </div>
        </div>

        <div style={{ background: "#F5F3FF", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 8 }}>
          <Info size={14} color="#7C3AED" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 11, color: "#6D28D9", lineHeight: 1.5 }}>
            Tax estimate is based on ATO 2024-25 tax brackets, LITO, and 2% Medicare levy. Super (11.5%) is paid by your employer on top of your gross pay — it&apos;s not deducted from take-home. Actual tax may vary.
          </p>
        </div>
      </div>

      {/* ── Results ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Main result */}
        <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)", borderRadius: 24, padding: "28px 32px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(124,58,237,0.15)", pointerEvents: "none" }} />
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 6 }}>This week&apos;s gross pay</p>
          <p style={{ fontSize: 44, fontWeight: 800, color: "white", letterSpacing: "-1.5px", marginBottom: 6 }}>
            {hrRate === 0 ? "$0.00" : fmtDec(grossWeekly)}
          </p>
          {overtime > 0 && hrRate > 0 && (
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>
              incl. {fmtDec(overtimePay)} overtime pay
            </p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            {[
              { label: "Take-home / week", value: hrRate > 0 ? fmtDec(netWeekly) : "$0.00", color: "#34D399" },
              { label: "Super (employer)", value: hrRate > 0 ? fmtDec(superWeekly) : "$0.00", color: "#A78BFA" },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 16px" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 4 }}>{s.label}</p>
                <p style={{ color: s.color, fontWeight: 700, fontSize: 16 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Period breakdown */}
        <div style={{ background: "white", borderRadius: 20, padding: "22px 24px", border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <p style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", marginBottom: 16 }}>Pay Period Breakdown</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { label: "Weekly",      gross: grossWeekly,       net: netWeekly,      icon: CalendarDays },
              { label: "Fortnightly", gross: grossFortnightly,  net: netWeekly * 2,  icon: CalendarCheck },
              { label: "Monthly",     gross: grossMonthly,      net: netMonthly,     icon: CalendarRange },
              { label: "Annual",      gross: grossAnnual,       net: netAnnual,      icon: BarChart3 },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid #F8FAFC" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <row.icon size={18} color="#7C3AED" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{row.label}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                    {hrRate > 0 ? fmtFull(row.gross) : "$0"}
                  </p>
                  <p style={{ fontSize: 12, color: "#10B981", fontWeight: 600 }}>
                    {hrRate > 0 ? fmtFull(row.net) + " take-home" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tax breakdown (expandable) */}
        <div style={{ background: "white", borderRadius: 20, border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
          <button
            onClick={() => setShowTax(!showTax)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", background: "none", border: "none", cursor: "pointer" }}
          >
            <span style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>Tax Breakdown (estimated)</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#F43F5E" }}>
                {hrRate > 0 ? `${effectiveRate.toFixed(1)}% effective rate` : ""}
              </span>
              {showTax ? <ChevronUp size={16} color="#94A3B8" /> : <ChevronDown size={16} color="#94A3B8" />}
            </div>
          </button>
          {showTax && (
            <div style={{ padding: "0 24px 20px", borderTop: "1px solid #F8FAFC" }}>
              {[
                { label: "Gross annual income", value: grossAnnual, color: "#0F172A" },
                { label: "Income tax (incl. LITO)", value: -tax, color: "#F43F5E" },
                { label: "Medicare levy (2%)", value: -medicare, color: "#F43F5E" },
                { label: "Take-home annual", value: netAnnual, color: "#10B981" },
                { label: "Super (on top, employer)", value: superAnnual, color: "#7C3AED" },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F8FAFC" }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>{row.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: row.color }}>
                    {hrRate > 0 ? (row.value < 0 ? "-" : "") + fmtFull(Math.abs(row.value)) : "$0"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Investment Calculator ─────────────────────────────────────────────────────
function InvestmentCalculator() {
  const [investmentType, setInvestmentType] = useState<InvestmentType>("etf");
  const [initial, setInitial] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [rate, setRate] = useState(9.5);
  const [years, setYears] = useState(10);

  const { accounts } = useAccounts();
  useEffect(() => {
    const total = accounts.reduce((s, a) => s + a.balance, 0);
    if (total > 0) setInitial(Math.round(total));
  }, [accounts]);

  const selectedType = investmentTypes.find((t) => t.id === investmentType)!;

  const { chartData, finalValue, totalContributions, totalGrowth } = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const data: { year: number; balance: number; contributions: number; growth: number }[] = [];
    let balance = initial;

    for (let y = 0; y <= years; y++) {
      const contributions = initial + monthly * 12 * y;
      data.push({ year: y, balance: Math.round(balance), contributions: Math.round(contributions), growth: Math.round(balance - contributions) });
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + monthlyRate) + monthly;
      }
    }

    const finalBalance = data[data.length - 1].balance;
    const totalContrib = initial + monthly * 12 * years;
    return {
      chartData: data,
      finalValue: finalBalance,
      totalContributions: totalContrib,
      totalGrowth: finalBalance - totalContrib,
    };
  }, [initial, monthly, rate, years]);

  const handleTypeChange = (id: InvestmentType) => {
    setInvestmentType(id);
    setRate(investmentTypes.find((t) => t.id === id)!.defaultRate);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24, alignItems: "start" }}>
      {/* Left: inputs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Investment type */}
        <div style={{ background: "white", borderRadius: 20, padding: "22px", border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <p style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", marginBottom: 14 }}>Investment Type</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {investmentTypes.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTypeChange(t.id)}
                style={{ padding: "12px 10px", borderRadius: 12, border: investmentType === t.id ? "2px solid #7C3AED" : "1px solid #E2E8F0", background: investmentType === t.id ? "#F5F3FF" : "white", cursor: "pointer", textAlign: "left" }}
              >
                <t.icon size={20} color={investmentType === t.id ? "#7C3AED" : "#94A3B8"} style={{ marginBottom: 4 }} />
                <p style={{ fontSize: 12, fontWeight: 700, color: investmentType === t.id ? "#7C3AED" : "#0F172A" }}>{t.label}</p>
                <p style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{t.defaultRate}% avg</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div style={{ background: "white", borderRadius: 20, padding: "22px", border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { icon: DollarSign, label: "Initial Investment", value: initial, set: setInitial, min: 0, max: 200000, step: 500,  display: fmtFull(initial) },
            { icon: Calendar,   label: "Monthly Contribution", value: monthly, set: setMonthly, min: 0, max: 5000,   step: 50,   display: fmtFull(monthly) + "/mo" },
            { icon: Percent,    label: "Annual Return Rate", value: rate,    set: setRate,    min: 0.5, max: 20,  step: 0.1, display: `${rate.toFixed(1)}%` },
            { icon: Calendar,   label: "Time Period",         value: years,   set: setYears,   min: 1,   max: 40,  step: 1,   display: `${years} years` },
          ].map((slider) => (
            <div key={slider.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <slider.icon size={15} color="#7C3AED" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}>{slider.label}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>{slider.display}</span>
              </div>
              <input
                type="range"
                min={slider.min} max={slider.max} step={slider.step}
                value={slider.value}
                onChange={(e) => slider.set(parseFloat(e.target.value))}
                style={{ width: "100%", height: 6, accentColor: "#7C3AED", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "#CBD5E1" }}>{slider.min}</span>
                <span style={{ fontSize: 10, color: "#CBD5E1" }}>{slider.max}</span>
              </div>
            </div>
          ))}

          <div style={{ background: "#F5F3FF", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 8 }}>
            <Info size={14} color="#7C3AED" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 11, color: "#6D28D9", lineHeight: 1.5 }}>
              {selectedType.description}. Past performance is not a guarantee of future returns.
            </p>
          </div>
        </div>
      </div>

      {/* Right: results */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Result card */}
        <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)", borderRadius: 24, padding: "28px 32px" }}>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 6 }}>
            Final Value after {years} years
          </p>
          <p style={{ fontSize: 44, fontWeight: 800, color: "white", letterSpacing: "-1.5px", marginBottom: 20 }}>
            {fmtFull(finalValue)}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[
              { label: "You invest",      value: fmtFull(totalContributions), color: "#94A3B8" },
              { label: "Compound growth", value: fmtFull(totalGrowth),        color: "#34D399" },
              { label: "Total return",    value: `${totalContributions > 0 ? ((totalGrowth / totalContributions) * 100).toFixed(0) : 0}%`, color: "#A78BFA" },
            ].map((stat) => (
              <div key={stat.label}>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, marginBottom: 4 }}>{stat.label}</p>
                <p style={{ color: stat.color, fontWeight: 700, fontSize: 15 }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div style={{ background: "white", borderRadius: 20, padding: "24px", border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>Growth Over Time</h3>
            <div style={{ display: "flex", gap: 16 }}>
              {[{ color: "#7C3AED", label: "Balance" }, { color: "#E2E8F0", label: "Contributions" }].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E2E8F0" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#E2E8F0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `Y${v}`} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={fmt} />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid #F1F5F9", borderRadius: 12, fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                  formatter={(v: unknown, name: unknown) => [fmtFull(Number(v)), name === "balance" ? "Total Balance" : "Total Contributed"]}
                  labelFormatter={(l) => `Year ${l}`}
                />
                <Area type="monotone" dataKey="contributions" stroke="#CBD5E1" strokeWidth={1.5} fill="url(#contribGrad)" dot={false} />
                <Area type="monotone" dataKey="balance"       stroke="#7C3AED" strokeWidth={2.5} fill="url(#balanceGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Milestones */}
        <div style={{ background: "white", borderRadius: 20, padding: "22px 24px", border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 16 }}>Key Milestones</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[{ yr: 5, icon: Sprout }, { yr: 10, icon: Leaf }, { yr: Math.round(years / 2), icon: TreePine }, { yr: years, icon: Trophy }]
              .filter((m, i, arr) => arr.findIndex((a) => a.yr === m.yr) === i && m.yr > 0 && m.yr <= years)
              .map((m) => {
                const point = chartData.find((d) => d.year === m.yr);
                if (!point) return null;
                return (
                  <div key={m.yr} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#F8FAFC", borderRadius: 12 }}>
                    <m.icon size={20} color="#7C3AED" />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>Year {m.yr} — {fmtFull(point.balance)}</p>
                      <p style={{ fontSize: 11, color: "#94A3B8" }}>{fmtFull(point.growth)} in compound growth</p>
                    </div>
                    <TrendingUp size={16} color="#10B981" />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CalculatorPage() {
  const [tab, setTab] = useState<CalcTab>("investment");

  return (
    <div style={{ padding: "24px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>Calculator</h1>
        <p style={{ color: "#64748B", fontSize: 14, marginTop: 2 }}>Investment growth and pay calculator</p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 4, background: "white", borderRadius: 16, padding: 4, border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 28, width: "fit-content" }}>
        {[
          { id: "investment" as CalcTab, label: "Investment Growth", icon: TrendingUp },
          { id: "pay"        as CalcTab, label: "Pay Calculator",    icon: Briefcase },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, background: tab === id ? "#7C3AED" : "transparent", color: tab === id ? "white" : "#64748B", whiteSpace: "nowrap" }}
          >
            <Icon size={16} />{label}
          </button>
        ))}
      </div>

      {tab === "investment" && <InvestmentCalculator />}
      {tab === "pay"        && <PayCalculator />}

      {/* Disclaimer */}
      <div style={{ marginTop: 28, padding: "14px 20px", borderRadius: 12, background: "#FFFBEB", border: "1px solid #FDE68A", display: "flex", alignItems: "flex-start", gap: 10 }}>
        <Calculator size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
          <strong>Disclaimer:</strong> All calculations are estimates for illustrative purposes only and do not constitute financial or tax advice. Consult a licensed financial adviser or registered tax agent before making decisions.
        </p>
      </div>
    </div>
  );
}

"use client";
import { useState, useMemo } from "react";
import {
  TrendingUp,
  Calculator,
  DollarSign,
  Calendar,
  Percent,
  Info,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type InvestmentType = "etf" | "savings" | "super" | "property";

const investmentTypes: { id: InvestmentType; label: string; emoji: string; defaultRate: number; description: string }[] = [
  { id: "etf", label: "ETF / Shares", emoji: "📈", defaultRate: 9.5, description: "Average ASX 200 historical return" },
  { id: "savings", label: "High-Interest Savings", emoji: "🏦", defaultRate: 5.5, description: "ING Savings Maximiser current rate" },
  { id: "super", label: "Superannuation", emoji: "🦘", defaultRate: 8.5, description: "Balanced fund average return" },
  { id: "property", label: "Property", emoji: "🏡", defaultRate: 6.8, description: "Average Australian property growth" },
];

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtFull(n: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
}

export default function CalculatorPage() {
  const [investmentType, setInvestmentType] = useState<InvestmentType>("etf");
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(9.5);
  const [years, setYears] = useState(20);

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
    const t = investmentTypes.find((t) => t.id === id)!;
    setRate(t.defaultRate);
  };

  return (
    <div style={{ padding: "24px", maxWidth: 960, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>
          Investment Calculator
        </h1>
        <p style={{ color: "#64748B", fontSize: 14, marginTop: 2 }}>
          See how your money grows over time with compound interest
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24, alignItems: "start" }}>
        {/* Left: inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Investment type */}
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: "22px",
              border: "1px solid #F1F5F9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <p style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", marginBottom: 14 }}>Investment Type</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {investmentTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTypeChange(t.id)}
                  style={{
                    padding: "12px 10px",
                    borderRadius: 12,
                    border: investmentType === t.id ? "2px solid #7C3AED" : "1px solid #E2E8F0",
                    background: investmentType === t.id ? "#F5F3FF" : "white",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{t.emoji}</div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: investmentType === t.id ? "#7C3AED" : "#0F172A" }}>
                    {t.label}
                  </p>
                  <p style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{t.defaultRate}% avg</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: "22px",
              border: "1px solid #F1F5F9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {[
              {
                icon: DollarSign,
                label: "Initial Investment",
                value: initial,
                set: setInitial,
                min: 0,
                max: 100000,
                step: 500,
                display: fmtFull(initial),
              },
              {
                icon: Calendar,
                label: "Monthly Contribution",
                value: monthly,
                set: setMonthly,
                min: 0,
                max: 5000,
                step: 50,
                display: fmtFull(monthly) + "/mo",
              },
              {
                icon: Percent,
                label: "Annual Return Rate",
                value: rate,
                set: setRate,
                min: 0.5,
                max: 20,
                step: 0.1,
                display: `${rate.toFixed(1)}%`,
              },
              {
                icon: Calendar,
                label: "Time Period",
                value: years,
                set: setYears,
                min: 1,
                max: 40,
                step: 1,
                display: `${years} years`,
              },
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
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={slider.value}
                  onChange={(e) => slider.set(parseFloat(e.target.value))}
                  style={{
                    width: "100%",
                    height: 6,
                    accentColor: "#7C3AED",
                    cursor: "pointer",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: "#CBD5E1" }}>{slider.min}</span>
                  <span style={{ fontSize: 10, color: "#CBD5E1" }}>{slider.max}</span>
                </div>
              </div>
            ))}

            <div
              style={{
                background: "#F5F3FF",
                borderRadius: 12,
                padding: "12px 14px",
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
              }}
            >
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
          <div
            style={{
              background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)",
              borderRadius: 24,
              padding: "28px 32px",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 6 }}>
              Final Value after {years} years {selectedType.emoji}
            </p>
            <p style={{ fontSize: 44, fontWeight: 800, color: "white", letterSpacing: "-1.5px", marginBottom: 20 }}>
              {fmtFull(finalValue)}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[
                { label: "You invest", value: fmtFull(totalContributions), color: "#94A3B8" },
                { label: "Compound growth", value: fmtFull(totalGrowth), color: "#34D399" },
                { label: "Total return", value: `${((totalGrowth / totalContributions) * 100).toFixed(0)}%`, color: "#A78BFA" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, marginBottom: 4 }}>{stat.label}</p>
                  <p style={{ color: stat.color, fontWeight: 700, fontSize: 15 }}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: "24px",
              border: "1px solid #F1F5F9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>Growth Over Time</h3>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: "#7C3AED" }} />
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>Balance</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: "#E2E8F0" }} />
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>Contributions</span>
                </div>
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
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `Y${v}`}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={fmt}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #F1F5F9",
                      borderRadius: 12,
                      fontSize: 12,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    }}
                    formatter={(v: unknown, name: unknown) => [
                      fmtFull(Number(v)),
                      name === "balance" ? "Total Balance" : "Total Contributed",
                    ]}
                    labelFormatter={(l) => `Year ${l}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="contributions"
                    stroke="#CBD5E1"
                    strokeWidth={1.5}
                    fill="url(#contribGrad)"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#7C3AED"
                    strokeWidth={2.5}
                    fill="url(#balanceGrad)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Milestones */}
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: "22px 24px",
              border: "1px solid #F1F5F9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 16 }}>Key Milestones</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { yr: 5, emoji: "🌱" },
                { yr: 10, emoji: "🌿" },
                { yr: Math.round(years / 2), emoji: "🌳" },
                { yr: years, emoji: "🏆" },
              ]
                .filter((m, i, arr) => arr.findIndex(a => a.yr === m.yr) === i && m.yr > 0 && m.yr <= years)
                .map((m) => {
                  const point = chartData.find((d) => d.year === m.yr);
                  if (!point) return null;
                  return (
                    <div
                      key={m.yr}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 14px",
                        background: "#F8FAFC",
                        borderRadius: 12,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{m.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
                          Year {m.yr} — {fmtFull(point.balance)}
                        </p>
                        <p style={{ fontSize: 11, color: "#94A3B8" }}>
                          {fmtFull(point.growth)} in compound growth
                        </p>
                      </div>
                      <TrendingUp size={16} color="#10B981" />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        style={{
          marginTop: 24,
          padding: "14px 20px",
          borderRadius: 12,
          background: "#FFFBEB",
          border: "1px solid #FDE68A",
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <Calculator size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
          <strong>Disclaimer:</strong> This calculator is for illustrative purposes only and does not constitute financial advice. Returns are not guaranteed. Past performance is not indicative of future results. Consider consulting a licensed financial adviser before making investment decisions.
        </p>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  User,
  Mail,
  Bell,
  Globe,
  DollarSign,
  Shield,
  ChevronRight,
  Check,
  Pencil,
  X,
} from "lucide-react";

const currencies = ["AUD", "USD", "BRL", "GBP", "EUR", "INR", "PHP", "NZD"];
const languages = ["English", "Português", "Hindi", "Filipino", "Mandarin", "Spanish"];

export default function SettingsPage() {
  const { data: session } = useSession();

  const [displayName, setDisplayName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savedName, setSavedName] = useState(false);

  const [currency, setCurrency] = useState("AUD");
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState({
    weeklyReport: true,
    unusualSpending: true,
    billReminders: true,
    fxAlerts: false,
  });

  // Load saved preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("mymate_displayName");
    const savedCurrency = localStorage.getItem("mymate_currency");
    const savedLanguage = localStorage.getItem("mymate_language");
    const savedNotifs = localStorage.getItem("mymate_notifications");

    if (saved) setDisplayName(saved);
    else if (session?.user?.name) setDisplayName(session.user.name);

    if (savedCurrency) setCurrency(savedCurrency);
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
  }, [session]);

  const startEditName = () => {
    setNameInput(displayName);
    setEditingName(true);
    setSavedName(false);
  };

  const saveName = () => {
    if (!nameInput.trim()) return;
    setDisplayName(nameInput.trim());
    localStorage.setItem("mymate_displayName", nameInput.trim());
    setEditingName(false);
    setSavedName(true);
    setTimeout(() => setSavedName(false), 2500);
  };

  const saveCurrency = (c: string) => {
    setCurrency(c);
    localStorage.setItem("mymate_currency", c);
  };

  const saveLanguage = (l: string) => {
    setLanguage(l);
    localStorage.setItem("mymate_language", l);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem("mymate_notifications", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "24px", maxWidth: 720, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>
          Settings
        </h1>
        <p style={{ color: "#64748B", fontSize: 14, marginTop: 4 }}>
          Manage your profile and preferences
        </p>
      </div>

      {/* Profile card */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          border: "1px solid #F1F5F9",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        {/* Purple header */}
        <div
          style={{
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            height: 80,
          }}
        />

        {/* Avatar + name */}
        <div style={{ padding: "0 28px 28px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 18, marginTop: -36, marginBottom: 24 }}>
            <div style={{ position: "relative" }}>
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={72}
                  height={72}
                  style={{
                    borderRadius: 18,
                    border: "4px solid white",
                    objectFit: "cover",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 18,
                    border: "4px solid white",
                    background: "linear-gradient(135deg, #7C3AED, #10B981)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    fontWeight: 800,
                    color: "white",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                  }}
                >
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div style={{ paddingBottom: 4 }}>
              <p style={{ fontWeight: 800, fontSize: 20, color: "#0F172A", lineHeight: 1.2 }}>
                {displayName || session?.user?.name || "..."}
              </p>
              <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>
                {session?.user?.email}
              </p>
            </div>
          </div>

          {/* Display name field */}
          <div
            style={{
              background: "#F8FAFC",
              borderRadius: 14,
              padding: "18px 20px",
              border: "1px solid #F1F5F9",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: editingName ? 14 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#EDE9FE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User size={16} color="#7C3AED" />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Display Name
                  </p>
                  {!editingName && (
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginTop: 1 }}>
                      {displayName || session?.user?.name || "—"}
                    </p>
                  )}
                </div>
              </div>
              {!editingName && (
                <button
                  onClick={startEditName}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: 10,
                    padding: "8px 14px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#7C3AED",
                  }}
                >
                  <Pencil size={13} /> Edit
                </button>
              )}
            </div>

            {editingName && (
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveName()}
                  placeholder="Your display name"
                  style={{
                    flex: 1,
                    border: "2px solid #7C3AED",
                    borderRadius: 10,
                    padding: "10px 14px",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#0F172A",
                    outline: "none",
                    background: "white",
                  }}
                />
                <button
                  onClick={saveName}
                  style={{
                    background: "#7C3AED",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 18px",
                    cursor: "pointer",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Check size={15} /> Save
                </button>
                <button
                  onClick={() => setEditingName(false)}
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: 10,
                    padding: "10px 12px",
                    cursor: "pointer",
                    color: "#64748B",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <X size={15} />
                </button>
              </div>
            )}
          </div>

          {savedName && (
            <div
              style={{
                marginTop: 12,
                background: "#ECFDF5",
                border: "1px solid #A7F3D0",
                borderRadius: 10,
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                fontWeight: 600,
                color: "#065F46",
              }}
            >
              <Check size={15} /> Display name updated!
            </div>
          )}

          {/* Email (read-only) */}
          <div
            style={{
              background: "#F8FAFC",
              borderRadius: 14,
              padding: "16px 20px",
              border: "1px solid #F1F5F9",
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#ECFEFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Mail size={16} color="#06B6D4" />
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Email (Google)
              </p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#64748B", marginTop: 1 }}>
                {session?.user?.email ?? "—"}
              </p>
            </div>
            <div
              style={{
                marginLeft: "auto",
                background: "#F1F5F9",
                borderRadius: 8,
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 600,
                color: "#94A3B8",
              }}
            >
              via Google
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          border: "1px solid #F1F5F9",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          padding: "24px 28px",
          marginBottom: 20,
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", marginBottom: 20 }}>
          Preferences
        </h2>

        {/* Base currency */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#ECFDF5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DollarSign size={16} color="#10B981" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>Base Currency</p>
              <p style={{ fontSize: 12, color: "#94A3B8" }}>All totals shown in this currency</p>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {currencies.map((c) => (
              <button
                key={c}
                onClick={() => saveCurrency(c)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  border: currency === c ? "2px solid #10B981" : "1px solid #E2E8F0",
                  background: currency === c ? "#ECFDF5" : "white",
                  color: currency === c ? "#065F46" : "#64748B",
                  fontWeight: currency === c ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#F5F3FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Globe size={16} color="#7C3AED" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>Language</p>
              <p style={{ fontSize: 12, color: "#94A3B8" }}>App display language</p>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => saveLanguage(l)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  border: language === l ? "2px solid #7C3AED" : "1px solid #E2E8F0",
                  background: language === l ? "#F5F3FF" : "white",
                  color: language === l ? "#5B21B6" : "#64748B",
                  fontWeight: language === l ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          border: "1px solid #F1F5F9",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          padding: "24px 28px",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "#FFFBEB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={16} color="#F59E0B" />
          </div>
          <h2 style={{ fontWeight: 700, fontSize: 16, color: "#0F172A" }}>Notifications</h2>
        </div>

        {[
          { key: "weeklyReport", label: "Weekly spending report", sub: "Every Monday morning" },
          { key: "unusualSpending", label: "Unusual spending alerts", sub: "When you spend more than usual" },
          { key: "billReminders", label: "Bill reminders", sub: "3 days before due date" },
          { key: "fxAlerts", label: "FX rate alerts", sub: "When your target rate is hit" },
        ].map((item, i, arr) => (
          <div
            key={item.key}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 0",
              borderBottom: i < arr.length - 1 ? "1px solid #F8FAFC" : "none",
            }}
          >
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{item.label}</p>
              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{item.sub}</p>
            </div>
            <button
              onClick={() => toggleNotification(item.key as keyof typeof notifications)}
              style={{
                width: 48,
                height: 28,
                borderRadius: 100,
                border: "none",
                cursor: "pointer",
                background: notifications[item.key as keyof typeof notifications] ? "#7C3AED" : "#E2E8F0",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 4,
                  left: notifications[item.key as keyof typeof notifications] ? 24 : 4,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "white",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                }}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Account */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          border: "1px solid #F1F5F9",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "24px 28px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={16} color="#64748B" />
            </div>
            <h2 style={{ fontWeight: 700, fontSize: 16, color: "#0F172A" }}>Account</h2>
          </div>
        </div>

        {[
          { label: "Privacy Policy", sub: "How we handle your data" },
          { label: "Terms of Service", sub: "Our terms and conditions" },
          { label: "Export my data", sub: "Download all your financial data" },
        ].map((item, i) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px 28px",
              borderTop: i === 0 ? "1px solid #F8FAFC" : "none",
              cursor: "pointer",
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{item.label}</p>
              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{item.sub}</p>
            </div>
            <ChevronRight size={16} color="#CBD5E1" />
          </div>
        ))}

        <div style={{ padding: "16px 28px 24px" }}>
          <button
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 12,
              border: "1px solid #FEE2E2",
              background: "#FFF1F2",
              color: "#F43F5E",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Delete Account
          </button>
        </div>
      </div>

      <p style={{ textAlign: "center", color: "#CBD5E1", fontSize: 12, marginTop: 24 }}>
        MyMate v1.0.0 · Built for Australia
      </p>
    </div>
  );
}

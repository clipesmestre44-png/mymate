"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  BookOpen,
  Calculator,
  Settings,
  TrendingUp,
  Bell,
  Menu,
  X,
  ChevronRight,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/accounts", icon: Wallet, label: "Accounts" },
  { href: "/dashboard/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { href: "/dashboard/guide", icon: BookOpen, label: "Spending Guide" },
  { href: "/dashboard/calculator", icon: Calculator, label: "Calculator" },
];

function UserAvatar({ image, name, size = 36 }: { image?: string | null; name?: string | null; size?: number }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? "User"}
        width={size}
        height={size}
        style={{ borderRadius: size / 3, objectFit: "cover", flexShrink: 0 }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 3,
        background: "linear-gradient(135deg, #7C3AED, #10B981)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.38,
        fontWeight: 700,
        color: "white",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div
      style={{
        width: 240,
        minHeight: "100%",
        background: "#0F172A",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, padding: "0 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={18} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "white" }}>MyMate</span>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 8px", marginBottom: 8 }}>
          Menu
        </p>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 12,
                textDecoration: "none",
                background: active ? "rgba(124,58,237,0.15)" : "transparent",
                color: active ? "#A78BFA" : "#94A3B8",
                fontWeight: active ? 600 : 500,
                fontSize: 14,
              }}
            >
              <Icon size={18} />
              {label}
              {active && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ borderTop: "1px solid #1E293B", paddingTop: 16, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 12 }}>
          <UserAvatar image={session?.user?.image} name={session?.user?.name} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {session?.user?.name ?? "Loading..."}
            </p>
            <p style={{ fontSize: 11, color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {session?.user?.email ?? ""}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
          <button
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "8px",
              borderRadius: 10,
              background: "none",
              border: "none",
              color: "#94A3B8",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <Settings size={14} /> Settings
          </button>
          <button
            onClick={handleSignOut}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "8px",
              borderRadius: 10,
              background: "none",
              border: "none",
              color: "#94A3B8",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F8FAFC" }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex" style={{ flexShrink: 0, flexDirection: "column" }}>
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex" }}>
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }}
          />
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Mobile header */}
        <div
          className="flex md:hidden"
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            height: 60,
            background: "white",
            borderBottom: "1px solid #F1F5F9",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUp size={16} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 17, color: "#0F172A" }}>MyMate</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 10,
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "#64748B",
              }}
            >
              <Bell size={18} />
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: 4,
              }}
            >
              <UserAvatar image={session?.user?.image} name={session?.user?.name} size={34} />
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 10,
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "#64748B",
              }}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>

        {/* Mobile bottom nav */}
        <MobileBottomNav />
      </div>
    </div>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();
  const items = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { href: "/dashboard/accounts", icon: Wallet, label: "Accounts" },
    { href: "/dashboard/transactions", icon: ArrowLeftRight, label: "Txns" },
    { href: "/dashboard/guide", icon: BookOpen, label: "Guide" },
    { href: "/dashboard/calculator", icon: Calculator, label: "Calc" },
  ];
  return (
    <div
      className="flex md:hidden"
      style={{
        background: "white",
        borderTop: "1px solid #F1F5F9",
        padding: "8px 0",
        flexShrink: 0,
      }}
    >
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "6px 4px",
              textDecoration: "none",
              color: active ? "#7C3AED" : "#94A3B8",
            }}
          >
            <Icon size={20} />
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";

export type AccountType = "everyday" | "savings" | "credit" | "investment" | "multi";
export type Currency = "AUD" | "USD" | "BRL" | "GBP" | "EUR" | "INR" | "NZD" | "PHP";

export interface Account {
  id: string;
  name: string;
  institution: string;
  type: AccountType;
  balance: number;
  currency: Currency;
  number: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  category: string;
  accountId: string;
  date: string;
  tags: string[];
}

export interface Goal {
  id: string;
  label: string;
  target: number;
  current: number;
  color: string;
}

export const ACCOUNT_META: Record<AccountType, { label: string; gradient: string; color: string; bg: string }> = {
  everyday:   { label: "Everyday Account",  gradient: "linear-gradient(135deg, #7C3AED, #4C1D95)", color: "#7C3AED", bg: "#F5F3FF" },
  savings:    { label: "Savings Account",   gradient: "linear-gradient(135deg, #10B981, #065F46)", color: "#10B981", bg: "#ECFDF5" },
  credit:     { label: "Credit Card",       gradient: "linear-gradient(135deg, #0F172A, #334155)", color: "#475569", bg: "#F8FAFC" },
  investment: { label: "Investment / ETF",  gradient: "linear-gradient(135deg, #F59E0B, #92400E)", color: "#F59E0B", bg: "#FFFBEB" },
  multi:      { label: "Multi-Currency",    gradient: "linear-gradient(135deg, #06B6D4, #0E7490)", color: "#06B6D4", bg: "#ECFEFF" },
};

// ── Accounts ──────────────────────────────────────────────────────────────────

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    fetch("/api/accounts")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setAccounts(data); })
      .catch(() => {});
  }, []);

  const addAccount = async (data: Omit<Account, "id" | "createdAt">) => {
    const next: Account = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setAccounts((prev) => [...prev, next]);
    await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
  };

  const updateBalance = async (id: string, balance: number) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, balance } : a)));
    await fetch("/api/accounts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, balance }),
    });
  };

  const deleteAccount = async (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/accounts?id=${id}`, { method: "DELETE" });
  };

  return { accounts, addAccount, updateBalance, deleteAccount };
}

// ── Transactions ──────────────────────────────────────────────────────────────

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch("/api/transactions")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setTransactions(data); })
      .catch(() => {});
  }, []);

  const addTransaction = async (data: Omit<Transaction, "id">) => {
    const next: Transaction = { ...data, id: crypto.randomUUID() };
    setTransactions((prev) => [next, ...prev]);
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
  };

  const deleteTransaction = async (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/transactions?id=${id}`, { method: "DELETE" });
  };

  return { transactions, addTransaction, deleteTransaction };
}

// ── Goals ─────────────────────────────────────────────────────────────────────

export const GOAL_COLORS = ["#7C3AED", "#10B981", "#F59E0B", "#06B6D4", "#F43F5E", "#8B5CF6"];

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    fetch("/api/goals")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setGoals(data); })
      .catch(() => {});
  }, []);

  const addGoal = async (data: Omit<Goal, "id">) => {
    const next: Goal = { ...data, id: crypto.randomUUID() };
    setGoals((prev) => [...prev, next]);
    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
  };

  const deleteGoal = async (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    await fetch(`/api/goals?id=${id}`, { method: "DELETE" });
  };

  return { goals, addGoal, deleteGoal };
}

// ── Checklist ─────────────────────────────────────────────────────────────────

const CHECKLIST_LEN = 7;

export function useChecklist() {
  const [done, setDone] = useState<boolean[]>(Array(CHECKLIST_LEN).fill(false));

  useEffect(() => {
    fetch("/api/checklist")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setDone(data);
      })
      .catch(() => {});
  }, []);

  const toggle = async (i: number) => {
    const next = done.map((v, j) => (j === i ? !v : v));
    setDone(next);
    await fetch("/api/checklist", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
  };

  return { done, toggle };
}

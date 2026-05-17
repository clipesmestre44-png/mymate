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

export const ACCOUNT_META: Record<AccountType, { label: string; gradient: string; color: string; bg: string }> = {
  everyday:   { label: "Everyday Account",    gradient: "linear-gradient(135deg, #7C3AED, #4C1D95)", color: "#7C3AED", bg: "#F5F3FF" },
  savings:    { label: "Savings Account",     gradient: "linear-gradient(135deg, #10B981, #065F46)", color: "#10B981", bg: "#ECFDF5" },
  credit:     { label: "Credit Card",         gradient: "linear-gradient(135deg, #0F172A, #334155)", color: "#475569", bg: "#F8FAFC" },
  investment: { label: "Investment / ETF",    gradient: "linear-gradient(135deg, #F59E0B, #92400E)", color: "#F59E0B", bg: "#FFFBEB" },
  multi:      { label: "Multi-Currency",      gradient: "linear-gradient(135deg, #06B6D4, #0E7490)", color: "#06B6D4", bg: "#ECFEFF" },
};

const EMIT = () => window.dispatchEvent(new Event("mymate_store_change"));

function read<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
  catch { return fallback; }
}

// ─── Accounts ────────────────────────────────────────────────────────────────

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    setAccounts(read("mymate_accounts", []));
    const h = () => setAccounts(read("mymate_accounts", []));
    window.addEventListener("mymate_store_change", h);
    return () => window.removeEventListener("mymate_store_change", h);
  }, []);

  const addAccount = (data: Omit<Account, "id" | "createdAt">) => {
    const list: Account[] = read("mymate_accounts", []);
    const next = [...list, { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }];
    localStorage.setItem("mymate_accounts", JSON.stringify(next));
    EMIT();
  };

  const updateBalance = (id: string, balance: number) => {
    const list: Account[] = read("mymate_accounts", []);
    localStorage.setItem("mymate_accounts", JSON.stringify(list.map(a => a.id === id ? { ...a, balance } : a)));
    EMIT();
  };

  const deleteAccount = (id: string) => {
    const list: Account[] = read("mymate_accounts", []);
    localStorage.setItem("mymate_accounts", JSON.stringify(list.filter(a => a.id !== id)));
    EMIT();
  };

  return { accounts, addAccount, updateBalance, deleteAccount };
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTransactions(read("mymate_transactions", []));
    const h = () => setTransactions(read("mymate_transactions", []));
    window.addEventListener("mymate_store_change", h);
    return () => window.removeEventListener("mymate_store_change", h);
  }, []);

  const addTransaction = (data: Omit<Transaction, "id">) => {
    const list: Transaction[] = read("mymate_transactions", []);
    const next = [{ ...data, id: crypto.randomUUID() }, ...list];
    localStorage.setItem("mymate_transactions", JSON.stringify(next));
    EMIT();
  };

  const deleteTransaction = (id: string) => {
    const list: Transaction[] = read("mymate_transactions", []);
    localStorage.setItem("mymate_transactions", JSON.stringify(list.filter(t => t.id !== id)));
    EMIT();
  };

  return { transactions, addTransaction, deleteTransaction };
}

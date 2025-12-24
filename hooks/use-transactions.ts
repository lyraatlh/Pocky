"use client"

import { useState, useEffect, useCallback } from "react"
import type { Transaction } from "@/types/transaction"

const STORAGE_KEY = "transactions"

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load transactions from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
        try {
            setTransactions(JSON.parse(stored))
        } catch (error) {
            console.error("Failed to parse transactions from localStorage", error)
        }
        }
        setIsLoaded(true)
    }, [])

    // Save transactions to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
        }
    }, [transactions, isLoaded])

    const addTransaction = useCallback((transaction: Omit<Transaction, "id">) => {
        const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
        }
        setTransactions((prev) => [newTransaction, ...prev])
    }, [])

    const updateTransaction = useCallback((id: string, updated: Omit<Transaction, "id">) => {
        setTransactions((prev) => prev.map((t) => (t.id === id ? { ...updated, id } : t)))
    }, [])

    const deleteTransaction = useCallback((id: string) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return {
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        isLoaded,
    }
}
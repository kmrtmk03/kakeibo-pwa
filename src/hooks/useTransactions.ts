import { useState, useCallback, useMemo } from 'react'
import type { Transaction, TransactionType, Category } from '../types/transaction'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories'
import { useLocalStorage } from './useLocalStorage'

/** LocalStorageのキー */
const STORAGE_KEY = 'kakeibo_data'

/**
 * 保存用の取引データ型（カテゴリはIDのみ）
 */
interface StoredTransaction {
  id: number
  type: TransactionType
  amount: number
  categoryId: string
  date: string
  note: string
}

/**
 * カテゴリIDからカテゴリオブジェクトを取得
 */
function getCategoryById(id: string, type: TransactionType): Category {
  const allCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
  return allCategories.find((c) => c.id === id) || allCategories[allCategories.length - 1]
}

/**
 * 取引データを保存用に変換
 */
function toStoredTransaction(t: Transaction): StoredTransaction {
  return {
    id: t.id,
    type: t.type,
    amount: t.amount,
    categoryId: t.category.id,
    date: t.date,
    note: t.note,
  }
}

/**
 * 保存データから取引データに変換
 */
function fromStoredTransaction(s: StoredTransaction): Transaction {
  return {
    id: s.id,
    type: s.type,
    amount: s.amount,
    category: getCategoryById(s.categoryId, s.type),
    date: s.date,
    note: s.note,
  }
}

/**
 * デモデータ生成
 */
function getDemoData(): StoredTransaction[] {
  const transactions: Transaction[] = [
    {
      id: 1,
      type: 'income',
      amount: 250000,
      category: INCOME_CATEGORIES[0],
      date: new Date().toISOString(),
      note: '今月分給与',
    },
    {
      id: 2,
      type: 'expense',
      amount: 3500,
      category: EXPENSE_CATEGORIES[0],
      date: new Date().toISOString(),
      note: 'スーパー',
    },
    {
      id: 3,
      type: 'expense',
      amount: 800,
      category: EXPENSE_CATEGORIES[6],
      date: new Date(Date.now() - 86400000).toISOString(),
      note: 'スタバ',
    },
    {
      id: 4,
      type: 'expense',
      amount: 12000,
      category: EXPENSE_CATEGORIES[3],
      date: new Date(Date.now() - 172800000).toISOString(),
      note: '電気代',
    },
  ]
  return transactions.map(toStoredTransaction)
}

/**
 * 取引データ管理用カスタムフック
 */
export function useTransactions() {
  // ローカルストレージで保存用データを管理
  const [storedTransactions, setStoredTransactions] = useLocalStorage<StoredTransaction[]>(
    STORAGE_KEY,
    getDemoData()
  )

  // 現在表示中の月
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  // アプリ内で扱う形式に変換
  const transactions = useMemo(() => {
    return storedTransactions.map(fromStoredTransaction)
  }, [storedTransactions])

  /**
   * 現在月の取引のみをフィルタ
   */
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const tDate = new Date(t.date)
      return (
        tDate.getMonth() === currentDate.getMonth() &&
        tDate.getFullYear() === currentDate.getFullYear()
      )
    })
  }, [transactions, currentDate])

  /**
   * 今月の合計収入
   */
  const totalIncome = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  }, [currentMonthTransactions])

  /**
   * 今月の合計支出
   */
  const totalExpense = useMemo(() => {
    return currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  }, [currentMonthTransactions])

  /**
   * 今月の残高
   */
  const balance = useMemo(() => totalIncome - totalExpense, [totalIncome, totalExpense])

  /**
   * 取引を追加
   */
  const addTransaction = useCallback(
    (type: TransactionType, amount: number, category: Category, note: string, date: Date) => {
      const newTransaction: Transaction = {
        id: Date.now(),
        type,
        amount,
        category,
        date: date.toISOString(),
        note,
      }

      const st = toStoredTransaction(newTransaction)
      setStoredTransactions((prev) => [st, ...prev])
    },
    [setStoredTransactions]
  )

  /**
   * 取引を削除
   */
  const deleteTransaction = useCallback((id: number) => {
    if (window.confirm('この記録を削除しますか？')) {
      setStoredTransactions((prev) => prev.filter((t) => t.id !== id))
    }
  }, [setStoredTransactions])

  /**
   * 月を変更
   */
  const changeMonth = useCallback((diff: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + diff)
      return newDate
    })
  }, [])

  /**
   * 金額を日本円形式でフォーマット
   */
  const formatYen = useCallback((num: number): string => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(num)
  }, [])

  return {
    transactions, // 全取引データ
    currentDate,
    currentMonthTransactions,
    totalIncome,
    totalExpense,
    balance,
    addTransaction,
    deleteTransaction,
    changeMonth,
    formatYen,
  }
}

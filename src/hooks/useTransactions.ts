import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Transaction, TransactionType, Category } from '../types/transaction'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories'

/** LocalStorageのキー */
const STORAGE_KEY = 'kakeibo_data'

/**
 * 取引データ管理用カスタムフック
 */
export function useTransactions() {
  // 取引データ
  const [transactions, setTransactions] = useState<Transaction[]>([])
  // 現在表示中の月
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  // ローディング状態
  const [isLoading, setIsLoading] = useState(true)

  /**
   * 初期データの読み込み
   */
  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as Transaction[]
        setTransactions(parsed)
      } catch (error) {
        console.error('データの読み込みに失敗しました:', error)
      }
    } else {
      // デモデータを設定
      const demoData: Transaction[] = [
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
      setTransactions(demoData)
    }
    setIsLoading(false)
  }, [])

  /**
   * データの永続化
   */
  useEffect(() => {
    if (typeof window === 'undefined' || isLoading) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions, isLoading])

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
    (type: TransactionType, amount: number, category: Category, note: string) => {
      const newTransaction: Transaction = {
        id: Date.now(),
        type,
        amount,
        category,
        date: new Date().toISOString(),
        note,
      }
      setTransactions((prev) => [newTransaction, ...prev])
    },
    []
  )

  /**
   * 取引を削除
   */
  const deleteTransaction = useCallback((id: number) => {
    if (window.confirm('この記録を削除しますか？')) {
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    }
  }, [])

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
    // 状態
    transactions,
    currentDate,
    currentMonthTransactions,
    totalIncome,
    totalExpense,
    balance,
    isLoading,
    // アクション
    addTransaction,
    deleteTransaction,
    changeMonth,
    formatYen,
  }
}

/**
 * @fileoverview 取引データ管理用カスタムフック
 *
 * このフックは家計簿アプリの取引データを管理します。
 * LocalStorageと連携してデータを永続化し、月別フィルタリングや集計機能を提供。
 *
 * @module hooks/useTransactions
 */

import { useState, useCallback, useMemo } from 'react'
import type { Transaction, TransactionType, Category } from '../types/transaction'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories'
import { useLocalStorage } from './useLocalStorage'

// ==============================================
// 定数
// ==============================================

/** LocalStorageのキー */
const STORAGE_KEY = 'kakeibo_data'

// ==============================================
// 型定義
// ==============================================

/**
 * 保存用の取引データ型
 * @description LocalStorageに保存する際はカテゴリオブジェクトではなくIDのみを保存
 */
interface StoredTransaction {
  /** 取引ID（タイムスタンプベース） */
  id: number
  /** 取引タイプ（収入/支出） */
  type: TransactionType
  /** 金額 */
  amount: number
  /** カテゴリID */
  categoryId: string
  /** 日付（ISO形式文字列） */
  date: string
  /** メモ */
  note: string
}

// ==============================================
// ヘルパー関数
// ==============================================

/**
 * カテゴリIDからカテゴリオブジェクトを取得
 * @param id - カテゴリID
 * @param type - 取引タイプ（収入/支出）
 * @returns カテゴリオブジェクト、見つからない場合は最後のカテゴリ（その他）
 */
function getCategoryById(id: string, type: TransactionType): Category {
  const allCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
  // IDで検索し、見つからない場合は「その他」カテゴリを返す
  return allCategories.find((c) => c.id === id) || allCategories[allCategories.length - 1]
}

/**
 * 取引データを保存用形式に変換
 * @description カテゴリオブジェクトをIDに変換してサイズを削減
 * @param t - 取引データ
 * @returns 保存用取引データ
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
 * 保存データからアプリ用形式に変換
 * @description カテゴリIDをカテゴリオブジェクトに展開
 * @param s - 保存用取引データ
 * @returns 取引データ
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
 * デモデータを生成
 * @description 初回起動時に表示するサンプルデータ
 * @returns 保存形式のサンプル取引データ配列
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
      // 1日前の日付を設定
      date: new Date(Date.now() - 86400000).toISOString(),
      note: 'スタバ',
    },
    {
      id: 4,
      type: 'expense',
      amount: 12000,
      category: EXPENSE_CATEGORIES[3],
      // 2日前の日付を設定
      date: new Date(Date.now() - 172800000).toISOString(),
      note: '電気代',
    },
  ]
  return transactions.map(toStoredTransaction)
}

// ==============================================
// カスタムフック
// ==============================================

/**
 * 取引データ管理用カスタムフック
 *
 * @description
 * 家計簿アプリの中核となるフック。以下の機能を提供:
 * - LocalStorageによるデータ永続化
 * - 月別フィルタリング
 * - 収支の合計・残高計算
 * - 取引の追加・削除
 * - 金額のフォーマット
 *
 * @example
 * ```tsx
 * const {
 *   currentMonthTransactions,
 *   totalIncome,
 *   totalExpense,
 *   balance,
 *   addTransaction,
 *   formatYen,
 * } = useTransactions()
 * ```
 */
export function useTransactions() {
  // ==============================================
  // 状態管理
  // ==============================================

  // ローカルストレージで保存用データを管理
  const [storedTransactions, setStoredTransactions] = useLocalStorage<StoredTransaction[]>(
    STORAGE_KEY,
    getDemoData()
  )

  // 現在表示中の月
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  // ==============================================
  // 派生値（useMemoで最適化）
  // ==============================================

  /**
   * 保存形式からアプリ内形式に変換した取引データ
   */
  const transactions = useMemo(() => {
    return storedTransactions.map(fromStoredTransaction)
  }, [storedTransactions])

  /**
   * 現在月の取引のみをフィルタ
   * @description 年と月の両方が一致するデータのみを抽出
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
   * 今月の残高（収入 - 支出）
   */
  const balance = useMemo(() => totalIncome - totalExpense, [totalIncome, totalExpense])

  // ==============================================
  // イベントハンドラ（useCallbackで最適化）
  // ==============================================

  /**
   * 取引を追加
   * @param type - 取引タイプ（収入/支出）
   * @param amount - 金額
   * @param category - カテゴリ
   * @param note - メモ
   * @param date - 日付
   */
  const addTransaction = useCallback(
    (type: TransactionType, amount: number, category: Category, note: string, date: Date) => {
      const newTransaction: Transaction = {
        // タイムスタンプをIDとして使用（一意性を担保）
        id: Date.now(),
        type,
        amount,
        category,
        date: date.toISOString(),
        note,
      }

      const st = toStoredTransaction(newTransaction)
      // 新しい取引を配列の先頭に追加（新しい順）
      setStoredTransactions((prev) => [st, ...prev])
    },
    [setStoredTransactions]
  )

  /**
   * 取引を削除
   * @param id - 削除する取引のID
   * @description 削除前に確認ダイアログを表示
   */
  const deleteTransaction = useCallback((id: number) => {
    if (window.confirm('この記録を削除しますか？')) {
      setStoredTransactions((prev) => prev.filter((t) => t.id !== id))
    }
  }, [setStoredTransactions])

  /**
   * 表示月を変更
   * @param diff - 移動する月数（-1: 前月、1: 翌月）
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
   * @param num - フォーマットする金額
   * @returns ¥記号付きのカンマ区切り文字列（例: ¥1,000）
   */
  const formatYen = useCallback((num: number): string => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(num)
  }, [])

  // ==============================================
  // 戻り値
  // ==============================================

  return {
    /** 全取引データ */
    transactions,
    /** 現在表示中の月 */
    currentDate,
    /** 現在月の取引データ */
    currentMonthTransactions,
    /** 今月の合計収入 */
    totalIncome,
    /** 今月の合計支出 */
    totalExpense,
    /** 今月の残高 */
    balance,
    /** 取引を追加する関数 */
    addTransaction,
    /** 取引を削除する関数 */
    deleteTransaction,
    /** 表示月を変更する関数 */
    changeMonth,
    /** 金額をフォーマットする関数 */
    formatYen,
  }
}

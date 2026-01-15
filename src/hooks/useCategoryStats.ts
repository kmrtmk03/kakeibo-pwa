/**
 * @fileoverview カテゴリ別統計計算用カスタムフック
 *
 * このフックは取引データからカテゴリ別の統計情報を計算します。
 * StatsPage.tsx からロジックを分離するために作成。
 *
 * @module hooks/useCategoryStats
 */

import { useMemo } from 'react'
import type { Transaction, Category } from '../types/transaction'
import { EXPENSE_CATEGORIES } from '../constants/categories'

// ==============================================
// 型定義
// ==============================================

/**
 * カテゴリ別統計の1アイテム
 */
export interface CategoryStat {
  /** カテゴリ情報 */
  category: Category
  /** カテゴリの合計金額 */
  total: number
  /** 全体に対するパーセンテージ */
  percentage: number
}

/**
 * フックが返す値の型定義
 */
interface UseCategoryStatsReturn {
  /** カテゴリ別統計（0円のカテゴリは除外済み） */
  categoryStats: CategoryStat[]
  /** 支出があるかどうか */
  hasExpense: boolean
}

// ==============================================
// カスタムフック
// ==============================================

/**
 * カテゴリ別統計計算用カスタムフック
 *
 * @description
 * 取引データからカテゴリ別の合計金額とパーセンテージを計算します。
 * - 支出のみを対象
 * - 0円のカテゴリは除外
 * - パーセンテージは小数点1桁まで計算
 *
 * @param transactions - 対象の取引一覧
 * @param totalExpense - 支出の合計金額
 *
 * @example
 * ```tsx
 * const { categoryStats, hasExpense } = useCategoryStats(transactions, totalExpense)
 *
 * categoryStats.map(stat => (
 *   <div key={stat.category.id}>
 *     {stat.category.name}: {stat.total}円 ({stat.percentage}%)
 *   </div>
 * ))
 * ```
 */
export function useCategoryStats(
  transactions: Transaction[],
  totalExpense: number
): UseCategoryStatsReturn {
  /**
   * カテゴリ別統計を計算
   * - 各カテゴリの合計金額を算出
   * - パーセンテージを計算
   * - 0円のカテゴリは除外
   */
  const categoryStats = useMemo<CategoryStat[]>(() => {
    return EXPENSE_CATEGORIES
      .map((category) => {
        // カテゴリごとの支出合計を計算
        const total = transactions
          .filter((t) => t.type === 'expense' && t.category.id === category.id)
          .reduce((sum, t) => sum + t.amount, 0)

        // パーセンテージを計算（0除算を防ぐ）
        const percentage = totalExpense > 0 ? (total / totalExpense) * 100 : 0

        return { category, total, percentage }
      })
      // 0円のカテゴリを除外
      .filter((stat) => stat.total > 0)
      // 金額が大きい順にソート
      .sort((a, b) => b.total - a.total)
  }, [transactions, totalExpense])

  /**
   * 支出があるかどうか
   */
  const hasExpense = useMemo(
    () => totalExpense > 0,
    [totalExpense]
  )

  return {
    categoryStats,
    hasExpense,
  }
}

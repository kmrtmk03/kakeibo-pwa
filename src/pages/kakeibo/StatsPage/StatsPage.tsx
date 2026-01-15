/**
 * @fileoverview 分析画面コンポーネント
 *
 * このコンポーネントは家計簿アプリの分析画面を担当します。
 * カテゴリ別の支出レポートを表示します。
 * 統計計算ロジックは useCategoryStats フックに分離されています。
 *
 * @module pages/kakeibo/StatsPage
 */

import type { ReactElement } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Transaction } from '../../../types/transaction'
import { useCategoryStats } from '../../../hooks/useCategoryStats'
import styles from './StatsPage.module.sass'

// ==============================================
// 型定義
// ==============================================

/**
 * StatsPage コンポーネントのプロパティ
 */
interface StatsPageProps {
  /** 現在表示中の日付 */
  currentDate: Date
  /** 月変更ハンドラ（-1で前月、+1で次月） */
  onChangeMonth: (diff: number) => void
  /** 今月の取引一覧 */
  transactions: Transaction[]
  /** 今月の支出合計 */
  totalExpense: number
  /** 金額フォーマッタ（数値を円表示に変換） */
  formatYen: (num: number) => string
}

// ==============================================
// コンポーネント
// ==============================================

/**
 * 分析画面コンポーネント
 *
 * @description
 * カテゴリ別の支出レポートを表示する画面です。
 * - 月ごとの支出合計
 * - カテゴリ別の内訳（金額・パーセンテージ）
 * - プログレスバーによる視覚化
 *
 * @example
 * ```tsx
 * <StatsPage
 *   currentDate={currentDate}
 *   onChangeMonth={changeMonth}
 *   transactions={currentMonthTransactions}
 *   totalExpense={totalExpense}
 *   formatYen={formatYen}
 * />
 * ```
 */
export function StatsPage({
  currentDate,
  onChangeMonth,
  transactions,
  totalExpense,
  formatYen,
}: StatsPageProps): ReactElement {
  // ==============================================
  // カスタムフックからカテゴリ統計を取得
  // ==============================================
  const { categoryStats, hasExpense } = useCategoryStats(
    transactions,
    totalExpense
  )

  // ==============================================
  // レンダリング
  // ==============================================
  return (
    <div className={styles.container}>
      {/* ========== ヘッダー ========== */}
      <header className={styles.header}>
        <h2 className={styles.title}>支出レポート</h2>

        {/* 月選択 */}
        <div className={styles.monthSelector}>
          <button
            onClick={() => onChangeMonth(-1)}
            className={styles.monthButton}
          >
            <ChevronLeft size={16} />
          </button>
          <span className={styles.monthLabel}>
            {currentDate.getMonth() + 1}月
          </span>
          <button
            onClick={() => onChangeMonth(1)}
            className={styles.monthButton}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </header>

      {/* ========== コンテンツ ========== */}
      <main className={styles.content}>
        {/* 年表示 */}
        <div className={styles.yearLabel}>{currentDate.getFullYear()}年</div>

        {/* 合計サークル */}
        <div className={styles.totalCard}>
          <div className={styles.totalCircle}>
            <div className={styles.totalInner}>
              <span className={styles.totalLabel}>支出合計</span>
              <span className={styles.totalAmount}>
                {formatYen(totalExpense)}
              </span>
            </div>
          </div>
        </div>

        {/* ========== カテゴリ別内訳 ========== */}
        <h3 className={styles.sectionTitle}>カテゴリ別内訳</h3>
        <div className={styles.categoryList}>
          {/* カテゴリ統計をマップしてカードを表示 */}
          {categoryStats.map((stat) => {
            const IconComponent = stat.category.icon
            return (
              <div key={stat.category.id} className={styles.categoryCard}>
                {/* カテゴリヘッダー */}
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryInfo}>
                    <div
                      className={`${styles.categoryIcon} ${styles[stat.category.colorClass]
                        }`}
                    >
                      <IconComponent size={16} />
                    </div>
                    <span className={styles.categoryName}>
                      {stat.category.name}
                    </span>
                  </div>
                  <div className={styles.categoryAmount}>
                    <span className={styles.amountValue}>
                      {formatYen(stat.total)}
                    </span>
                    <span className={styles.percentValue}>
                      {stat.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* プログレスバー */}
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            )
          })}

          {/* データがない場合のメッセージ */}
          {!hasExpense && (
            <div className={styles.emptyState}>データがありません</div>
          )}
        </div>
      </main>
    </div>
  )
}

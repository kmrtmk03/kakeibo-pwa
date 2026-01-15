import type { ReactElement } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Transaction } from '../../../types/transaction'
import { EXPENSE_CATEGORIES } from '../../../constants/categories'
import styles from './StatsPage.module.sass'

interface StatsPageProps {
  /** 現在表示中の日付 */
  currentDate: Date
  /** 月変更ハンドラ */
  onChangeMonth: (diff: number) => void
  /** 今月の取引一覧 */
  transactions: Transaction[]
  /** 今月の支出合計 */
  totalExpense: number
  /** 金額フォーマッタ */
  formatYen: (num: number) => string
}

/**
 * 分析画面コンポーネント
 * カテゴリ別支出レポート
 */
export function StatsPage({
  currentDate,
  onChangeMonth,
  transactions,
  totalExpense,
  formatYen,
}: StatsPageProps): ReactElement {
  return (
    <div className={styles.container}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <h2 className={styles.title}>支出レポート</h2>
        <div className={styles.monthSelector}>
          <button onClick={() => onChangeMonth(-1)} className={styles.monthButton}>
            <ChevronLeft size={16} />
          </button>
          <span className={styles.monthLabel}>{currentDate.getMonth() + 1}月</span>
          <button onClick={() => onChangeMonth(1)} className={styles.monthButton}>
            <ChevronRight size={16} />
          </button>
        </div>
      </header>

      {/* コンテンツ */}
      <div className={styles.content}>
        <div className={styles.yearLabel}>{currentDate.getFullYear()}年</div>

        {/* 合計サークル */}
        <div className={styles.totalCard}>
          <div className={styles.totalCircle}>
            <div className={styles.totalInner}>
              <span className={styles.totalLabel}>支出合計</span>
              <span className={styles.totalAmount}>{formatYen(totalExpense)}</span>
            </div>
          </div>
        </div>

        {/* カテゴリ別内訳 */}
        <h3 className={styles.sectionTitle}>カテゴリ別内訳</h3>
        <div className={styles.categoryList}>
          {EXPENSE_CATEGORIES.map((cat) => {
            // カテゴリごとの合計を計算
            const catTotal = transactions
              .filter((t) => t.type === 'expense' && t.category.id === cat.id)
              .reduce((sum, t) => sum + t.amount, 0)

            // 0円のカテゴリはスキップ
            if (catTotal === 0) return null

            // パーセンテージを計算
            const percentage = totalExpense > 0 ? (catTotal / totalExpense) * 100 : 0
            const IconComponent = cat.icon

            return (
              <div key={cat.id} className={styles.categoryCard}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryInfo}>
                    <div className={`${styles.categoryIcon} ${styles[cat.colorClass]}`}>
                      <IconComponent size={16} />
                    </div>
                    <span className={styles.categoryName}>{cat.name}</span>
                  </div>
                  <div className={styles.categoryAmount}>
                    <span className={styles.amountValue}>{formatYen(catTotal)}</span>
                    <span className={styles.percentValue}>{percentage.toFixed(1)}%</span>
                  </div>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
          {totalExpense === 0 && (
            <div className={styles.emptyState}>データがありません</div>
          )}
        </div>
      </div>
    </div>
  )
}

import type { ReactElement } from 'react'
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Trash2 } from 'lucide-react'
import type { Transaction } from '../../../types/transaction'
import styles from './HomePage.module.sass'

interface HomePageProps {
  /** 現在表示中の日付 */
  currentDate: Date
  /** 月変更ハンドラ */
  onChangeMonth: (diff: number) => void
  /** 今月の残高 */
  balance: number
  /** 今月の収入合計 */
  totalIncome: number
  /** 今月の支出合計 */
  totalExpense: number
  /** 今月の取引一覧 */
  transactions: Transaction[]
  /** 削除ハンドラ */
  onDelete: (id: number) => void
  /** 金額フォーマッタ */
  formatYen: (num: number) => string
}

/**
 * ホーム画面コンポーネント
 * 残高表示と取引履歴一覧
 */
export function HomePage({
  currentDate,
  onChangeMonth,
  balance,
  totalIncome,
  totalExpense,
  transactions,
  onDelete,
  formatYen,
}: HomePageProps): ReactElement {
  // 日付順にソート
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <>
      {/* ヘッダー */}
      <header className={styles.header}>
        <div className={styles.monthSelector}>
          <button onClick={() => onChangeMonth(-1)} className={styles.monthButton}>
            <ChevronLeft />
          </button>
          <h2 className={styles.monthTitle}>
            {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
          </h2>
          <button onClick={() => onChangeMonth(1)} className={styles.monthButton}>
            <ChevronRight />
          </button>
        </div>

        <div className={styles.balanceSection}>
          <p className={styles.balanceLabel}>今月の残高</p>
          <h1 className={styles.balanceAmount}>{formatYen(balance)}</h1>
        </div>

        <div className={styles.summaryRow}>
          <div className={styles.summaryItem}>
            <p className={styles.summaryLabel}>
              <TrendingUp size={14} /> 収入
            </p>
            <p className={styles.summaryValue}>{formatYen(totalIncome)}</p>
          </div>
          <div className={styles.summaryItem}>
            <p className={styles.summaryLabel}>
              <TrendingDown size={14} /> 支出
            </p>
            <p className={styles.summaryValue}>{formatYen(totalExpense)}</p>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className={styles.main}>
        <div className={styles.transactionCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>最近の記録</h3>
            <span className={styles.cardCount}>{transactions.length}件</span>
          </div>

          <div className={styles.transactionList}>
            {sortedTransactions.length === 0 ? (
              <div className={styles.emptyState}>
                <p>今月の記録はまだありません</p>
                <p className={styles.emptyHint}>下のボタンから追加しましょう</p>
              </div>
            ) : (
              sortedTransactions.map((t) => {
                const IconComponent = t.category.icon
                return (
                  <div key={t.id} className={styles.transactionItem}>
                    <div className={styles.transactionLeft}>
                      <div className={`${styles.categoryIcon} ${styles[t.category.colorClass]}`}>
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <p className={styles.categoryName}>{t.category.name}</p>
                        <p className={styles.transactionMeta}>
                          {new Date(t.date).toLocaleDateString()}
                        </p>
                        {t.note && (
                          <p className={styles.transactionNote}>{t.note}</p>
                        )}
                      </div>
                    </div>
                    <div className={styles.transactionRight}>
                      <span
                        className={`${styles.amount} ${t.type === 'income' ? styles.income : ''}`}
                      >
                        {t.type === 'income' ? '+' : '-'}
                        {formatYen(t.amount)}
                      </span>
                      <button onClick={() => onDelete(t.id)} className={styles.deleteButton}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>
    </>
  )
}

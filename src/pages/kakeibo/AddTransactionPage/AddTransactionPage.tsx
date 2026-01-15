/**
 * @fileoverview 取引追加画面コンポーネント
 *
 * このコンポーネントは家計簿アプリの取引追加画面を担当します。
 * ロジック（状態管理、ハンドラ）は useAddTransaction フックに分離されており、
 * このファイルは純粋なビュー層として機能します。
 *
 * @module pages/kakeibo/AddTransactionPage
 */

import type { ReactElement } from 'react'
import type { TransactionType, Category } from '../../../types/transaction'
import { useAddTransaction } from '../../../hooks/useAddTransaction'
import { NumPad } from '../../../components/NumPad'
import styles from './AddTransactionPage.module.sass'

// ==============================================
// 型定義
// ==============================================

/**
 * AddTransactionPage コンポーネントのプロパティ
 */
interface AddTransactionPageProps {
  /** 取引追加ハンドラ（親コンポーネントから渡される） */
  onAddTransaction: (
    type: TransactionType,
    amount: number,
    category: Category,
    note: string,
    date: Date
  ) => void
  /** 追加完了後のコールバック（通常はホーム画面への遷移） */
  onComplete: () => void
}

// ==============================================
// コンポーネント
// ==============================================

/**
 * 取引追加画面コンポーネント
 *
 * @description
 * 支出/収入の記録を追加するための画面です。
 * - 支出/収入の切り替え
 * - カテゴリ選択
 * - 金額入力（テンキー）
 * - メモ入力
 *
 * @example
 * ```tsx
 * <AddTransactionPage
 *   onAddTransaction={addTransaction}
 *   onComplete={() => setActiveTab('home')}
 * />
 * ```
 */
export function AddTransactionPage({
  onAddTransaction,
  onComplete,
}: AddTransactionPageProps): ReactElement {
  // ==============================================
  // カスタムフックからロジックを取得
  // ==============================================
  const {
    // 状態
    inputType,
    amount,
    selectedCategory,
    note,
    selectedDate,
    // 派生値
    categories,
    isSubmitDisabled,
    // ハンドラ
    handleNumInput,
    handleNumDelete,
    handleTypeChange,
    handleCategorySelect,
    handleNoteChange,
    handleDateChange,
    handleSubmit,
  } = useAddTransaction({ onAddTransaction, onComplete })

  // ==============================================
  // レンダリング
  // ==============================================
  return (
    <div className={styles.container}>
      {/* ========== ヘッダー ========== */}
      <header className={styles.header}>
        <h2 className={styles.title}>記録を追加</h2>

        {/* 支出/収入 切り替えトグル */}
        <div className={styles.typeToggle}>
          <button
            onClick={() => handleTypeChange('expense')}
            className={`${styles.typeButton} ${inputType === 'expense' ? styles.expenseActive : ''
              }`}
          >
            支出
          </button>
          <button
            onClick={() => handleTypeChange('income')}
            className={`${styles.typeButton} ${inputType === 'income' ? styles.incomeActive : ''
              }`}
          >
            収入
          </button>
        </div>
      </header>

      {/* ========== カテゴリ選択セクション ========== */}
      <section className={styles.categorySection}>
        <p className={styles.sectionLabel}>カテゴリ</p>
        <div className={styles.categoryGrid}>
          {categories.map((cat) => {
            const IconComponent = cat.icon
            const isSelected = selectedCategory.id === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat)}
                className={`${styles.categoryButton} ${isSelected ? styles.selected : ''
                  }`}
              >
                <div
                  className={`${styles.categoryIcon} ${styles[cat.colorClass]}`}
                >
                  <IconComponent size={20} />
                </div>
                <span className={styles.categoryName}>{cat.name}</span>
              </button>
            )
          })}
        </div>

        {/* 日付選択 */}
        <div className={styles.dateSection}>
          <p className={styles.sectionLabel}>日付</p>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => handleDateChange(new Date(e.target.value))}
            className={styles.dateInput}
          />
        </div>

        {/* メモ入力 */}
        <div className={styles.noteSection}>
          <p className={styles.sectionLabel}>メモ (任意)</p>
          <input
            type="text"
            value={note}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder="例：ランチ、日用品..."
            className={styles.noteInput}
          />
        </div>
      </section>

      {/* ========== キーパッドエリア ========== */}
      <div className={styles.keypadArea}>
        {/* 金額表示（キーパッドの上に配置） */}
        <div className={styles.amountSection}>
          <div className={styles.amountDisplay}>
            <span
              className={`${styles.currency} ${inputType === 'expense' ? styles.expense : styles.income
                }`}
            >
              ¥
            </span>
            <input
              type="text"
              readOnly
              value={amount}
              placeholder="0"
              className={`${styles.amountInput} ${inputType === 'expense' ? styles.expense : styles.income
                }`}
            />
          </div>
        </div>

        {/* テンキー */}
        <NumPad onInput={handleNumInput} onDelete={handleNumDelete} />

        {/* 決定ボタン */}
        <div className={styles.submitSection}>
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`${styles.submitButton} ${isSubmitDisabled
              ? styles.disabled
              : inputType === 'expense'
                ? styles.expenseButton
                : styles.incomeButton
              }`}
          >
            決定
          </button>
        </div>
      </div>
    </div>
  )
}

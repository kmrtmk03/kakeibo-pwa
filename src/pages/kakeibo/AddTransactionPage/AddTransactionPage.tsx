import { useState, type ReactElement } from 'react'
import type { TransactionType, Category } from '../../../types/transaction'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../../constants/categories'
import { NumPad } from '../../../components/NumPad'
import styles from './AddTransactionPage.module.sass'

interface AddTransactionPageProps {
  /** 取引追加ハンドラ */
  onAddTransaction: (type: TransactionType, amount: number, category: Category, note: string) => void
  /** 追加完了後のコールバック */
  onComplete: () => void
}

/**
 * 取引追加画面コンポーネント
 * 金額入力、カテゴリ選択、メモ入力が可能
 */
export function AddTransactionPage({
  onAddTransaction,
  onComplete,
}: AddTransactionPageProps): ReactElement {
  // 入力タイプ（支出/収入）
  const [inputType, setInputType] = useState<TransactionType>('expense')
  // 金額（文字列として管理）
  const [amount, setAmount] = useState('')
  // 選択中のカテゴリ
  const [selectedCategory, setSelectedCategory] = useState<Category>(EXPENSE_CATEGORIES[0])
  // メモ
  const [note, setNote] = useState('')

  // 表示するカテゴリ一覧
  const categories = inputType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  /**
   * 数字入力ハンドラ
   */
  const handleNumInput = (val: string) => {
    setAmount((prev) => {
      const current = prev || ''
      // 8桁まで
      if (current.length >= 8) return current
      return current + val
    })
  }

  /**
   * 削除ハンドラ
   */
  const handleNumDelete = () => {
    setAmount((prev) => {
      const current = prev || ''
      return current.slice(0, -1)
    })
  }

  /**
   * タイプ切り替えハンドラ
   */
  const handleTypeChange = (type: TransactionType) => {
    setInputType(type)
    // カテゴリもリセット
    setSelectedCategory(type === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0])
  }

  /**
   * 決定ボタンハンドラ
   */
  const handleSubmit = () => {
    if (!amount || Number(amount) === 0) return

    onAddTransaction(inputType, Number(amount), selectedCategory, note)

    // リセット
    setAmount('')
    setNote('')
    onComplete()
  }

  return (
    <div className={styles.container}>
      {/* ヘッダー */}
      <div className={styles.header}>
        <h2 className={styles.title}>記録を追加</h2>
        <div className={styles.typeToggle}>
          <button
            onClick={() => handleTypeChange('expense')}
            className={`${styles.typeButton} ${inputType === 'expense' ? styles.expenseActive : ''}`}
          >
            支出
          </button>
          <button
            onClick={() => handleTypeChange('income')}
            className={`${styles.typeButton} ${inputType === 'income' ? styles.incomeActive : ''}`}
          >
            収入
          </button>
        </div>
      </div>

      {/* 金額表示 */}
      <div className={styles.amountSection}>
        <p className={styles.amountLabel}>金額を入力</p>
        <div className={styles.amountDisplay}>
          <span className={`${styles.currency} ${inputType === 'expense' ? styles.expense : styles.income}`}>
            ¥
          </span>
          <input
            type="text"
            readOnly
            value={amount}
            placeholder="0"
            className={`${styles.amountInput} ${inputType === 'expense' ? styles.expense : styles.income}`}
          />
        </div>
      </div>

      {/* カテゴリ選択 */}
      <div className={styles.categorySection}>
        <p className={styles.sectionLabel}>カテゴリ</p>
        <div className={styles.categoryGrid}>
          {categories.map((cat) => {
            const IconComponent = cat.icon
            const isSelected = selectedCategory.id === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`${styles.categoryButton} ${isSelected ? styles.selected : ''}`}
              >
                <div className={`${styles.categoryIcon} ${styles[cat.colorClass]}`}>
                  <IconComponent size={20} />
                </div>
                <span className={styles.categoryName}>{cat.name}</span>
              </button>
            )
          })}
        </div>

        {/* メモ入力 */}
        <div className={styles.noteSection}>
          <p className={styles.sectionLabel}>メモ (任意)</p>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="例：ランチ、日用品..."
            className={styles.noteInput}
          />
        </div>
      </div>

      {/* キーパッドエリア */}
      <div className={styles.keypadArea}>
        <div className={styles.submitSection}>
          <button
            onClick={handleSubmit}
            disabled={!amount}
            className={`${styles.submitButton} ${!amount
                ? styles.disabled
                : inputType === 'expense'
                  ? styles.expenseButton
                  : styles.incomeButton
              }`}
          >
            決定
          </button>
        </div>
        <NumPad onInput={handleNumInput} onDelete={handleNumDelete} />
      </div>
    </div>
  )
}

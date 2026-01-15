/**
 * @fileoverview 取引追加ページ用カスタムフック
 *
 * このフックは取引追加画面で使用する状態管理とイベントハンドラを提供します。
 * ビューコンポーネント（AddTransactionPage.tsx）からロジックを分離するために作成。
 *
 * @module hooks/useAddTransaction
 */

import { useState, useCallback, useMemo } from 'react'
import type { TransactionType, Category } from '../types/transaction'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories'

// ==============================================
// 型定義
// ==============================================

/**
 * フックに渡すプロパティ
 */
interface UseAddTransactionProps {
  /** 取引追加時に呼ばれるコールバック */
  onAddTransaction: (
    type: TransactionType,
    amount: number,
    category: Category,
    note: string,
    date: Date
  ) => void
  /** 追加完了時に呼ばれるコールバック（画面遷移など） */
  onComplete: () => void
}

/**
 * フックが返す値の型定義
 */
interface UseAddTransactionReturn {
  // ========== 状態 ==========
  /** 入力タイプ（支出/収入） */
  inputType: TransactionType
  /** 金額（文字列として管理） */
  amount: string
  /** 選択中のカテゴリ */
  selectedCategory: Category
  /** メモ */
  note: string
  /** 選択中の日付 */
  selectedDate: Date

  // ========== 派生値 ==========
  /** 表示するカテゴリ一覧（inputTypeに応じて切り替え） */
  categories: Category[]
  /** 送信ボタンが無効化されるかどうか */
  isSubmitDisabled: boolean

  // ========== ハンドラ ==========
  /** 数字入力時のハンドラ */
  handleNumInput: (val: string) => void
  /** 削除ボタン押下時のハンドラ */
  handleNumDelete: () => void
  /** 支出/収入切り替え時のハンドラ */
  handleTypeChange: (type: TransactionType) => void
  /** カテゴリ選択時のハンドラ */
  handleCategorySelect: (category: Category) => void
  /** メモ変更時のハンドラ */
  handleNoteChange: (note: string) => void
  /** 日付変更時のハンドラ */
  handleDateChange: (date: Date) => void
  /** 決定ボタン押下時のハンドラ */
  handleSubmit: () => void
}

// ==============================================
// 定数
// ==============================================

/** 金額入力の最大桁数 */
const MAX_AMOUNT_DIGITS = 8

// ==============================================
// カスタムフック
// ==============================================

/**
 * 取引追加ページ用カスタムフック
 *
 * @description
 * 取引追加画面で必要な状態管理とイベントハンドラをカプセル化します。
 * - 金額入力（8桁制限）
 * - 支出/収入の切り替え
 * - カテゴリ選択
 * - メモ入力
 * - 送信処理
 *
 * @example
 * ```tsx
 * const {
 *   inputType,
 *   amount,
 *   handleNumInput,
 *   handleSubmit,
 *   // ...
 * } = useAddTransaction({ onAddTransaction, onComplete })
 * ```
 */
export function useAddTransaction({
  onAddTransaction,
  onComplete,
}: UseAddTransactionProps): UseAddTransactionReturn {
  // ==============================================
  // 状態管理
  // ==============================================

  /** 入力タイプ（支出/収入） */
  const [inputType, setInputType] = useState<TransactionType>('expense')

  /** 金額（文字列として管理することで先頭の0や長さ制限を扱いやすくする） */
  const [amount, setAmount] = useState('')

  /** 選択中のカテゴリ（初期値は支出カテゴリの先頭） */
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    EXPENSE_CATEGORIES[0]
  )

  /** メモ */
  const [note, setNote] = useState('')

  /** 選択中の日付（初期値は今日） */
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // ==============================================
  // 派生値（useMemoで最適化）
  // ==============================================

  /**
   * 表示するカテゴリ一覧
   * @description inputTypeに応じて支出カテゴリか収入カテゴリを返す
   */
  const categories = useMemo(
    () => (inputType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES),
    [inputType]
  )

  /**
   * 送信ボタンの無効化判定
   * @description 金額が未入力または0の場合は無効
   */
  const isSubmitDisabled = useMemo(
    () => !amount || Number(amount) === 0,
    [amount]
  )

  // ==============================================
  // イベントハンドラ（useCallbackで最適化）
  // ==============================================

  /**
   * 数字入力ハンドラ
   * @description テンキーからの数字入力を処理
   * - 最大8桁まで入力可能
   * - "00"も1つの入力として処理
   */
  const handleNumInput = useCallback((val: string) => {
    setAmount((prev) => {
      const current = prev || ''
      // 8桁を超える場合は入力を無視
      if (current.length >= MAX_AMOUNT_DIGITS) return current
      return current + val
    })
  }, [])

  /**
   * 削除ハンドラ
   * @description 末尾の1文字を削除
   */
  const handleNumDelete = useCallback(() => {
    setAmount((prev) => {
      const current = prev || ''
      return current.slice(0, -1)
    })
  }, [])

  /**
   * タイプ切り替えハンドラ
   * @description 支出と収入を切り替える
   * - カテゴリも対応するものにリセット
   */
  const handleTypeChange = useCallback((type: TransactionType) => {
    setInputType(type)
    // カテゴリを切り替え先のデフォルトにリセット
    setSelectedCategory(
      type === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]
    )
  }, [])

  /**
   * カテゴリ選択ハンドラ
   */
  const handleCategorySelect = useCallback((category: Category) => {
    setSelectedCategory(category)
  }, [])

  /**
   * メモ変更ハンドラ
   */
  const handleNoteChange = useCallback((newNote: string) => {
    setNote(newNote)
  }, [])

  /**
   * 日付変更ハンドラ
   */
  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date)
  }, [])

  /**
   * 決定ボタンハンドラ
   * @description 取引を追加してフォームをリセット
   */
  const handleSubmit = useCallback(() => {
    // バリデーション: 金額が空または0の場合は処理しない
    if (!amount || Number(amount) === 0) return

    // 親コンポーネントに取引データを渡す
    onAddTransaction(inputType, Number(amount), selectedCategory, note, selectedDate)

    // フォームをリセット
    setAmount('')
    setNote('')

    // 完了コールバックを呼び出し（画面遷移など）
    onComplete()
  }, [amount, inputType, selectedCategory, note, selectedDate, onAddTransaction, onComplete])

  // ==============================================
  // 戻り値
  // ==============================================

  return {
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
  }
}

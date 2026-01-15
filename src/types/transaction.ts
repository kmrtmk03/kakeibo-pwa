import type { LucideIcon } from 'lucide-react'

/**
 * 取引種別
 * - expense: 支出
 * - income: 収入
 */
export type TransactionType = 'expense' | 'income'

/**
 * カテゴリの型定義
 */
export interface Category {
  /** カテゴリID */
  id: string
  /** カテゴリ名 */
  name: string
  /** アイコンコンポーネント */
  icon: LucideIcon
  /** CSSクラス名（背景色・文字色） */
  colorClass: string
}

/**
 * 取引データの型定義
 */
export interface Transaction {
  /** 取引ID（タイムスタンプ） */
  id: number
  /** 取引種別 */
  type: TransactionType
  /** 金額 */
  amount: number
  /** カテゴリ */
  category: Category
  /** 日時（ISO 8601形式） */
  date: string
  /** メモ */
  note: string
}

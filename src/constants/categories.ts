import {
  Utensils,
  ShoppingBag,
  Train,
  Zap,
  Stethoscope,
  Gamepad2,
  Coffee,
  MoreHorizontal,
  Wallet,
  TrendingUp,
} from 'lucide-react'
import type { Category } from '../types/transaction'

/**
 * 支出カテゴリ一覧
 */
export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: '食費', icon: Utensils, colorClass: 'category-food' },
  { id: 'daily', name: '日用品', icon: ShoppingBag, colorClass: 'category-daily' },
  { id: 'transport', name: '交通費', icon: Train, colorClass: 'category-transport' },
  { id: 'utility', name: '光熱費', icon: Zap, colorClass: 'category-utility' },
  { id: 'medical', name: '医療費', icon: Stethoscope, colorClass: 'category-medical' },
  { id: 'hobby', name: '趣味', icon: Gamepad2, colorClass: 'category-hobby' },
  { id: 'cafe', name: 'カフェ', icon: Coffee, colorClass: 'category-cafe' },
  { id: 'other', name: 'その他', icon: MoreHorizontal, colorClass: 'category-other' },
]

/**
 * 収入カテゴリ一覧
 */
export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: '給与', icon: Wallet, colorClass: 'category-salary' },
  { id: 'bonus', name: 'ボーナス', icon: TrendingUp, colorClass: 'category-bonus' },
  { id: 'other_income', name: 'その他', icon: MoreHorizontal, colorClass: 'category-other' },
]

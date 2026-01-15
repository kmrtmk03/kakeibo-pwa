import {
  Utensils,
  ShoppingBag,
  Train,
  Gamepad2,
  Coffee,
  MoreHorizontal,
  Wallet,
  TrendingUp,
  Shirt,
  Users,
  CreditCard,
} from 'lucide-react'
import type { Category } from '../types/transaction'

/**
 * 支出カテゴリ一覧
 */
export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: '食費', icon: Utensils, colorClass: 'category-food' },
  { id: 'daily', name: '日用品', icon: ShoppingBag, colorClass: 'category-daily' },
  { id: 'transport', name: '交通費', icon: Train, colorClass: 'category-transport' },
  { id: 'fashion', name: '衣服', icon: Shirt, colorClass: 'category-fashion' },
  { id: 'social', name: '交際費', icon: Users, colorClass: 'category-social' },
  { id: 'credit', name: 'カード', icon: CreditCard, colorClass: 'category-credit' },
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

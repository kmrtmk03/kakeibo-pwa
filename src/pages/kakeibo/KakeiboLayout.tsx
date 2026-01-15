/**
 * @fileoverview 家計簿アプリのレイアウトコンポーネント
 *
 * このコンポーネントは家計簿アプリ全体のレイアウトを管理します。
 * - 画面（タブ）の切り替え
 * - 取引データの状態管理（useTransactionsフック経由）
 * - ナビゲーションバーの配置
 *
 * 各画面（HomePage, AddTransactionPage, StatsPage）は
 * このコンポーネントから必要なpropsを受け取ります。
 *
 * @module pages/kakeibo/KakeiboLayout
 */

import { useState, type ReactElement } from 'react'
import type { TabType } from '../../components/Navigation'
import { Navigation } from '../../components/Navigation'
import { useTransactions } from '../../hooks/useTransactions'
import { HomePage } from './HomePage'
import { AddTransactionPage } from './AddTransactionPage'
import { StatsPage } from './StatsPage'
import styles from './KakeiboLayout.module.sass'

/**
 * 家計簿アプリのレイアウトコンポーネント
 * 各画面の切り替えとナビゲーションを管理
 */
export function KakeiboLayout(): ReactElement {
  // アクティブなタブ
  const [activeTab, setActiveTab] = useState<TabType>('home')

  // 取引データ管理フック
  const {
    currentDate,
    currentMonthTransactions,
    totalIncome,
    totalExpense,
    balance,
    addTransaction,
    deleteTransaction,
    changeMonth,
    formatYen,
  } = useTransactions()

  /**
   * タブ変更ハンドラ
   */
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
  }

  /**
   * 取引追加完了後のハンドラ
   */
  const handleAddComplete = () => {
    setActiveTab('home')
  }

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        {/* コンテンツエリア */}
        <div className={styles.content}>
          {/* ホーム画面 */}
          {activeTab === 'home' && (
            <HomePage
              currentDate={currentDate}
              onChangeMonth={changeMonth}
              balance={balance}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              transactions={currentMonthTransactions}
              onDelete={deleteTransaction}
              formatYen={formatYen}
            />
          )}

          {/* 取引追加画面 */}
          {activeTab === 'add' && (
            <AddTransactionPage
              onAddTransaction={addTransaction}
              onComplete={handleAddComplete}
            />
          )}

          {/* 分析画面 */}
          {activeTab === 'stats' && (
            <StatsPage
              currentDate={currentDate}
              onChangeMonth={changeMonth}
              transactions={currentMonthTransactions}
              totalExpense={totalExpense}
              formatYen={formatYen}
            />
          )}
        </div>

        {/* ナビゲーションバー */}
        <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  )
}

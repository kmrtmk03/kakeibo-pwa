import type { ReactElement } from 'react'
import { Home, PlusCircle, PieChart } from 'lucide-react'
import styles from './Navigation.module.sass'

/** ナビゲーションタブの種類 */
export type TabType = 'home' | 'add' | 'stats'

interface NavigationProps {
  /** 現在アクティブなタブ */
  activeTab: TabType
  /** タブ変更時のコールバック */
  onTabChange: (tab: TabType) => void
}

/**
 * ナビゲーションバーコンポーネント
 * 画面下部に固定表示されるタブナビゲーション
 */
export function Navigation({ activeTab, onTabChange }: NavigationProps): ReactElement {
  return (
    <nav className={styles.nav}>
      {/* ホームタブ */}
      <button
        onClick={() => onTabChange('home')}
        className={`${styles.tabButton} ${activeTab === 'home' ? styles.active : ''}`}
      >
        <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
        <span className={styles.label}>ホーム</span>
      </button>

      {/* 追加タブ（中央の丸ボタン） */}
      <button onClick={() => onTabChange('add')} className={styles.addButton}>
        <div className={`${styles.addButtonInner} ${activeTab === 'add' ? styles.active : ''}`}>
          <PlusCircle size={28} color="white" />
        </div>
        <span className={styles.addLabel}>記録</span>
      </button>

      {/* 分析タブ */}
      <button
        onClick={() => onTabChange('stats')}
        className={`${styles.tabButton} ${activeTab === 'stats' ? styles.active : ''}`}
      >
        <PieChart size={24} strokeWidth={activeTab === 'stats' ? 2.5 : 2} />
        <span className={styles.label}>分析</span>
      </button>
    </nav>
  )
}

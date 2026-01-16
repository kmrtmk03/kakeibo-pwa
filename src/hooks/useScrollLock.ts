/**
 * @fileoverview スクロールロック用カスタムフック
 *
 * モーダルや全画面オーバーレイ表示時に背景のスクロールを
 * 無効化するためのフック。
 *
 * @module hooks/useScrollLock
 */

import { useEffect } from 'react'

/**
 * スクロールロック用カスタムフック
 *
 * @description
 * フックが使用されている間、bodyのスクロールを無効化します。
 * コンポーネントのアンマウント時に自動的に元のスタイルに戻ります。
 *
 * @example
 * ```tsx
 * // モーダルコンポーネントで使用
 * const Modal = () => {
 *   useScrollLock()
 *   return <div className="modal">...</div>
 * }
 * ```
 */
const useScrollLock = () => {
  useEffect(() => {
    // 現在のoverflowスタイルを保存（後で復元するため）
    const originalStyle = window.getComputedStyle(document.body).overflow

    // bodyのスクロールを無効にする
    document.body.style.overflow = 'hidden'

    // クリーンアップ: コンポーネントのアンマウント時に元のスタイルに戻す
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, []) // 空の依存配列 = 初回マウント時のみ実行
}

export default useScrollLock
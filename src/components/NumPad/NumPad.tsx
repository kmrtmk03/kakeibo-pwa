import type { ReactElement } from 'react'
import { Delete } from 'lucide-react'
import styles from './NumPad.module.sass'

interface NumPadProps {
  /** 数字入力時のコールバック */
  onInput: (value: string) => void
  /** 削除ボタン押下時のコールバック */
  onDelete: () => void
}

/**
 * 数字キーパッドコンポーネント
 * 金額入力用のテンキー
 */
export function NumPad({ onInput, onDelete }: NumPadProps): ReactElement {
  // キー配列
  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '00', '0', 'BS']

  /**
   * キー押下ハンドラ
   */
  const handleKeyPress = (keyVal: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (keyVal === 'BS') {
      onDelete()
    } else {
      onInput(keyVal)
    }
  }

  return (
    <div className={styles.numpad}>
      {keys.map((keyVal) => (
        <button
          key={keyVal}
          type="button"
          onClick={(e) => handleKeyPress(keyVal, e)}
          className={`${styles.key} ${keyVal === 'BS' ? styles.deleteKey : ''}`}
        >
          {keyVal === 'BS' ? <Delete size={24} /> : keyVal}
        </button>
      ))}
    </div>
  )
}

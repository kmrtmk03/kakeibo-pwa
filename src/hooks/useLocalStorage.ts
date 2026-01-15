/**
 * @fileoverview ローカルストレージ管理用カスタムフック
 *
 * このフックはローカルストレージへの読み書きを抽象化し、
 * Reactの状態と同期させます。
 *
 * @module hooks/useLocalStorage
 */

import { useState, useEffect, useCallback } from 'react'

/**
 * ローカルストレージ管理用カスタムフック
 *
 * @template T 保存するデータの型
 * @param key ローカルストレージのキー
 * @param initialValue 初期値
 * @returns [格納値, 更新関数, エラー]
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 初期値の取得関数
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }, [key, initialValue])

  // 状態管理
  const [storedValue, setStoredValue] = useState<T>(readValue)

  // 値の更新関数
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // 関数が渡された場合は現在の値を元に計算
        const valueToStore =
          value instanceof Function ? value(storedValue) : value

        // 状態を更新
        setStoredValue(valueToStore)

        // ローカルストレージを更新
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // 外部からの変更（他のタブなど）を検知して同期
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.warn(`Error parsing localStorage key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [key])

  return [storedValue, setValue] as const
}

import './App.sass'
import type { ReactElement } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { KakeiboLayout } from './pages/kakeibo'

function App(): ReactElement {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          {/* 家計簿アプリ（ルート） */}
          <Route path="/" element={<KakeiboLayout />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App


import './App.sass'
import type { ReactElement } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { KakeiboLayout } from './pages/kakeibo'

function App(): ReactElement {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* 家計簿アプリ */}
          <Route path="/kakeibo" element={<KakeiboLayout />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App

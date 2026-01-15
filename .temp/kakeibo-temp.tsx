import React, { useState, useEffect } from 'react';
import { 
  Home, 
  PlusCircle, 
  PieChart, 
  ChevronLeft, 
  ChevronRight, 
  Coffee, 
  ShoppingBag, 
  Utensils, 
  Train, 
  Zap, 
  Stethoscope, 
  Gamepad2, 
  MoreHorizontal,
  Wallet,
  TrendingUp,
  TrendingDown,
  Trash2,
  Delete
} from 'lucide-react';

/**
 * 家計簿アプリ
 * 修正: NumPadを別コンポーネントとして定義し、再レンダリング時のイベント消失を防ぐ
 * 修正: 金額表示をinputタグに変更し、表示の確実性を向上
 */

// カテゴリ定義
const EXPENSE_CATEGORIES = [
  { id: 'food', name: '食費', icon: Utensils, color: 'bg-orange-100 text-orange-600' },
  { id: 'daily', name: '日用品', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
  { id: 'transport', name: '交通費', icon: Train, color: 'bg-green-100 text-green-600' },
  { id: 'utility', name: '光熱費', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'medical', name: '医療費', icon: Stethoscope, color: 'bg-red-100 text-red-600' },
  { id: 'hobby', name: '趣味', icon: Gamepad2, color: 'bg-purple-100 text-purple-600' },
  { id: 'cafe', name: 'カフェ', icon: Coffee, color: 'bg-brown-100 text-amber-700' },
  { id: 'other', name: 'その他', icon: MoreHorizontal, color: 'bg-gray-100 text-gray-600' },
];

const INCOME_CATEGORIES = [
  { id: 'salary', name: '給与', icon: Wallet, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'bonus', name: 'ボーナス', icon: TrendingUp, color: 'bg-teal-100 text-teal-600' },
  { id: 'other_income', name: 'その他', icon: MoreHorizontal, color: 'bg-gray-100 text-gray-600' },
];

// --- 独立した数字キーパッドコンポーネント ---
const NumPad = ({ onInput, onDelete }) => {
  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '00', '0', 'BS'];
  
  return (
    <div className="grid grid-cols-3 gap-2 p-4 bg-gray-50 rounded-t-2xl shadow-inner border-t border-gray-100">
      {keys.map(keyVal => (
        <button
          key={keyVal}
          type="button" // 重要: フォーム送信を防ぐ
          onClick={(e) => {
            e.preventDefault(); // デフォルト動作（フォーカス移動など）を防ぐ
            if (keyVal === 'BS') {
              onDelete();
            } else {
              onInput(keyVal);
            }
          }}
          className={`h-14 rounded-xl shadow-sm text-2xl font-medium transition-all outline-none touch-manipulation flex items-center justify-center active:scale-95 active:shadow-inner cursor-pointer select-none ${
            keyVal === 'BS' 
              ? 'bg-red-50 text-red-400 active:bg-red-100' 
              : 'bg-white text-gray-700 active:bg-gray-100'
          }`}
        >
          {keyVal === 'BS' ? <Delete size={24} /> : keyVal}
        </button>
      ))}
    </div>
  );
};

export default function KakeiboApp() {
  // --- State ---
  const [activeTab, setActiveTab] = useState('home');
  const [transactions, setTransactions] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // 入力用State
  const [inputType, setInputType] = useState('expense'); // 'expense' or 'income'
  const [amount, setAmount] = useState(''); // 文字列として管理
  const [selectedCategory, setSelectedCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [note, setNote] = useState('');

  // --- 初期データ読み込み ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('kakeibo_data');
      if (savedData) {
        setTransactions(JSON.parse(savedData));
      } else {
        const demoData = [
          { id: 1, type: 'income', amount: 250000, category: INCOME_CATEGORIES[0], date: new Date().toISOString(), note: '今月分給与' },
          { id: 2, type: 'expense', amount: 3500, category: EXPENSE_CATEGORIES[0], date: new Date().toISOString(), note: 'スーパー' },
          { id: 3, type: 'expense', amount: 800, category: EXPENSE_CATEGORIES[6], date: new Date(Date.now() - 86400000).toISOString(), note: 'スタバ' },
          { id: 4, type: 'expense', amount: 12000, category: EXPENSE_CATEGORIES[3], date: new Date(Date.now() - 172800000).toISOString(), note: '電気代' },
          { id: 5, type: 'expense', amount: 5000, category: EXPENSE_CATEGORIES[0], date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), note: '先月の買い物' },
        ];
        setTransactions(demoData);
      }
    }
  }, []);

  // --- データ保存 ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kakeibo_data', JSON.stringify(transactions));
    }
  }, [transactions]);

  // --- 計算ロジック ---
  const currentMonthTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === currentDate.getMonth() && tDate.getFullYear() === currentDate.getFullYear();
  });

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // --- アクション ---
  // 数字入力ハンドラ
  const handleNumInput = (val) => {
    setAmount((prev) => {
      // prevがnull/undefinedの場合は空文字として扱う
      const current = prev ? String(prev) : '';
      if (current.length >= 8) return current;
      return current + val;
    });
  };

  // 削除ハンドラ
  const handleNumDelete = () => {
    setAmount((prev) => {
      const current = prev ? String(prev) : '';
      return current.slice(0, -1);
    });
  };

  const handleAddTransaction = () => {
    if (!amount || Number(amount) === 0) return;

    const newTransaction = {
      id: Date.now(),
      type: inputType,
      amount: Number(amount),
      category: selectedCategory,
      date: new Date().toISOString(),
      note: note
    };

    setTransactions([newTransaction, ...transactions]);
    
    // リセット
    setAmount('');
    setNote('');
    setActiveTab('home');
  };

  const handleDelete = (id) => {
    if (window.confirm('この記録を削除しますか？')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const changeMonth = (diff) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + diff);
    setCurrentDate(newDate);
  };

  const formatYen = (num) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(num);
  };

  // --- 画面レンダリング ---
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start font-sans text-gray-800">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl relative overflow-hidden flex flex-col">
        
        {/* コンテンツエリア */}
        <div className="flex-1 overflow-y-auto pb-24 scroll-smooth">
          
          {/* --- ヘッダー (Home) --- */}
          {activeTab === 'home' && (
            <header className="bg-emerald-500 pt-12 pb-24 px-6 text-white rounded-b-[2.5rem] shadow-lg relative z-10">
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/20 rounded-full transition"><ChevronLeft /></button>
                <h2 className="text-xl font-bold tracking-widest">
                  {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
                </h2>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/20 rounded-full transition"><ChevronRight /></button>
              </div>
              
              <div className="text-center mb-2">
                <p className="text-emerald-100 text-sm mb-1">今月の残高</p>
                <h1 className="text-4xl font-bold tracking-tight">{formatYen(balance)}</h1>
              </div>

              <div className="flex justify-between mt-6 px-4">
                <div className="text-center w-1/2 border-r border-white/30">
                  <p className="text-emerald-100 text-xs mb-1 flex items-center justify-center gap-1"><TrendingUp size={14} /> 収入</p>
                  <p className="text-lg font-semibold">{formatYen(totalIncome)}</p>
                </div>
                <div className="text-center w-1/2">
                  <p className="text-emerald-100 text-xs mb-1 flex items-center justify-center gap-1"><TrendingDown size={14} /> 支出</p>
                  <p className="text-lg font-semibold">{formatYen(totalExpense)}</p>
                </div>
              </div>
            </header>
          )}

          {/* --- ホーム画面 --- */}
          {activeTab === 'home' && (
            <main className="px-5 -mt-16 relative z-20">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-gray-700">最近の記録</h3>
                  <span className="text-xs text-gray-400">{currentMonthTransactions.length}件</span>
                </div>
                
                <div className="pb-4">
                  {currentMonthTransactions.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                      <p>今月の記録はまだありません</p>
                      <p className="text-sm mt-2">下のボタンから追加しましょう</p>
                    </div>
                  ) : (
                    currentMonthTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).map((t) => (
                      <div key={t.id} className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition group">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.category.color}`}>
                            <t.category.icon size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">{t.category.name}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(t.date).toLocaleDateString()} {t.note && `• ${t.note}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-gray-800'}`}>
                            {t.type === 'income' ? '+' : '-'}{formatYen(t.amount)}
                          </span>
                          <button 
                            onClick={() => handleDelete(t.id)}
                            className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </main>
          )}

          {/* --- 入力画面 --- */}
          {activeTab === 'add' && (
            <div className="h-full bg-white flex flex-col animate-fade-in">
              <div className="p-4 pt-12 flex items-center justify-between bg-white sticky top-0 z-20">
                <h2 className="text-xl font-bold">記録を追加</h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => { setInputType('expense'); setSelectedCategory(EXPENSE_CATEGORIES[0]); }}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${inputType === 'expense' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-500'}`}
                  >
                    支出
                  </button>
                  <button 
                    onClick={() => { setInputType('income'); setSelectedCategory(INCOME_CATEGORIES[0]); }}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${inputType === 'income' ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-500'}`}
                  >
                    収入
                  </button>
                </div>
              </div>

              {/* 金額表示エリア (Inputタグに変更) */}
              <div className="px-6 py-6 text-center bg-white z-10">
                <p className="text-gray-400 text-sm mb-2">金額を入力</p>
                <div className="relative inline-block w-full max-w-[200px]">
                  <span className={`absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-bold ${inputType === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>¥</span>
                  <input
                    type="text"
                    readOnly
                    value={amount}
                    placeholder="0"
                    className={`w-full text-center text-5xl font-bold tracking-tight bg-transparent border-none focus:ring-0 p-0 pl-6 ${inputType === 'expense' ? 'text-rose-500 placeholder-rose-200' : 'text-emerald-500 placeholder-emerald-200'}`}
                  />
                </div>
              </div>

              {/* カテゴリ選択 */}
              <div className="px-4 pb-4">
                <p className="text-xs font-bold text-gray-400 mb-3 ml-1">カテゴリ</p>
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {(inputType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex flex-col items-center gap-2 p-2 rounded-xl transition border ${
                        selectedCategory.id === cat.id 
                          ? `bg-gray-50 border-${inputType === 'expense' ? 'rose' : 'emerald'}-200 ring-1 ring-${inputType === 'expense' ? 'rose' : 'emerald'}-400` 
                          : 'bg-white border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cat.color}`}>
                        <cat.icon size={20} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">{cat.name}</span>
                    </button>
                  ))}
                </div>

                {/* メモ入力 */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-400 mb-2 ml-1">メモ (任意)</p>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="例：ランチ、日用品..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* キーパッドエリア (フッター固定風) */}
              <div className="mt-auto bg-white border-t border-gray-100">
                <div className="px-4 py-2">
                  <button
                    onClick={handleAddTransaction}
                    disabled={!amount}
                    className={`w-full py-3.5 rounded-xl text-white font-bold shadow-lg transition transform active:scale-[0.98] ${
                      !amount 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : inputType === 'expense' ? 'bg-rose-500 shadow-rose-200' : 'bg-emerald-500 shadow-emerald-200'
                    }`}
                  >
                    決定
                  </button>
                </div>
                
                {/* 独立したコンポーネントを使用 */}
                <NumPad onInput={handleNumInput} onDelete={handleNumDelete} />
              </div>
            </div>
          )}

          {/* --- 分析画面 --- */}
          {activeTab === 'stats' && (
            <div className="h-full bg-gray-50">
              <header className="bg-white pt-12 pb-4 px-6 shadow-sm sticky top-0 z-10 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">支出レポート</h2>
                
                <div className="flex items-center bg-gray-100 rounded-full p-1">
                  <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-white rounded-full transition shadow-sm hover:shadow text-gray-600">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="mx-2 text-sm font-bold text-gray-700 w-20 text-center">
                    {currentDate.getMonth() + 1}月
                  </span>
                  <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-white rounded-full transition shadow-sm hover:shadow text-gray-600">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </header>

              <div className="p-4">
                <div className="text-center mb-6">
                  <p className="text-gray-400 text-xs mb-1">{currentDate.getFullYear()}年</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex items-center justify-center flex-col">
                  <div className="w-32 h-32 rounded-full border-[12px] border-emerald-100 flex items-center justify-center relative">
                      <div className="text-center">
                          <span className="text-xs text-gray-400 block">支出合計</span>
                          <span className="font-bold text-gray-800 text-xl">{formatYen(totalExpense)}</span>
                      </div>
                  </div>
                </div>

                <h3 className="font-bold text-gray-700 mb-4 px-1">カテゴリ別内訳</h3>
                <div className="space-y-3">
                  {EXPENSE_CATEGORIES.map(cat => {
                    const catTotal = currentMonthTransactions
                      .filter(t => t.type === 'expense' && t.category.id === cat.id)
                      .reduce((sum, t) => sum + Number(t.amount), 0);
                    
                    if (catTotal === 0) return null;
                    
                    const percentage = totalExpense > 0 ? (catTotal / totalExpense) * 100 : 0;

                    return (
                      <div key={cat.id} className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cat.color}`}>
                              <cat.icon size={16} />
                            </div>
                            <span className="font-medium text-gray-700">{cat.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold block">{formatYen(catTotal)}</span>
                            <span className="text-xs text-gray-400">{percentage.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                  {totalExpense === 0 && (
                    <div className="text-center py-10 text-gray-400">
                      データがありません
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        
        </div>

        {/* --- ナビゲーションバー --- */}
        <nav className="absolute bottom-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-20 pb-4 z-50">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 w-16 transition ${activeTab === 'home' ? 'text-emerald-500' : 'text-gray-400'}`}
          >
            <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">ホーム</span>
          </button>

          <button 
            onClick={() => setActiveTab('add')}
            className="flex flex-col items-center justify-center -mt-6"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition transform active:scale-95 ${activeTab === 'add' ? 'bg-emerald-600 ring-4 ring-emerald-100' : 'bg-emerald-500'}`}
              style={{ boxShadow: activeTab === 'add' ? '0 10px 25px -5px rgba(16, 185, 129, 0.4)' : 'none' }}
            >
              <PlusCircle size={28} color="white" />
            </div>
            <span className="text-[10px] font-medium text-gray-500 mt-2">記録</span>
          </button>

          <button 
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center gap-1 w-16 transition ${activeTab === 'stats' ? 'text-emerald-500' : 'text-gray-400'}`}
          >
            <PieChart size={24} strokeWidth={activeTab === 'stats' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">分析</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
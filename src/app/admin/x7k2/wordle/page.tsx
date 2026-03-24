'use client'

import { useState } from 'react'
import AdminGuard from '@/components/AdminGuard'

const mockWords = [
  { id: '1', word: 'كتاب', date: '2026-03-23', difficulty: 'easy', hint: 'تقرأ فيه' },
  { id: '2', word: 'شجرة', date: '2026-03-24', difficulty: 'easy', hint: 'تنمو في الأرض' },
  { id: '3', word: 'قمر', date: '2026-03-25', difficulty: 'medium', hint: 'يضيء الليل' },
]

const difficultyLabel: Record<string, string> = {
  easy: 'سهل',
  medium: 'متوسط',
  hard: 'صعب',
}
const difficultyColor: Record<string, string> = {
  easy: 'text-green-400 bg-green-500/10',
  medium: 'text-yellow-400 bg-yellow-500/10',
  hard: 'text-red-400 bg-red-500/10',
}

export default function WordlePage() {
  const [newWord, setNewWord] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newDifficulty, setNewDifficulty] = useState('medium')
  const [newHint, setNewHint] = useState('')

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-laqi-text">كلمات Wordle</h1>
          <p className="text-laqi-muted mt-1">إدارة الكلمة اليومية</p>
        </div>

        {/* Add Word */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-black text-laqi-text mb-4">إضافة كلمة جديدة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-laqi-muted mb-1.5">الكلمة</label>
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="اكتب الكلمة..."
                className="input-dark"
              />
            </div>
            <div>
              <label className="block text-sm text-laqi-muted mb-1.5">التاريخ</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="input-dark"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm text-laqi-muted mb-1.5">الصعوبة</label>
              <select
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value)}
                className="input-dark"
              >
                <option value="easy">سهل</option>
                <option value="medium">متوسط</option>
                <option value="hard">صعب</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-laqi-muted mb-1.5">تلميح (اختياري)</label>
              <input
                type="text"
                value={newHint}
                onChange={(e) => setNewHint(e.target.value)}
                placeholder="تلميح للاعب..."
                className="input-dark"
              />
            </div>
          </div>
          <button className="btn-neon mt-4 px-6 py-2.5 text-sm">إضافة الكلمة</button>
        </div>

        {/* Words List */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-laqi-border">
            <h2 className="font-black text-laqi-text">الكلمات المجدولة</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-laqi-border text-laqi-muted text-right">
                <th className="px-4 py-3 font-bold">الكلمة</th>
                <th className="px-4 py-3 font-bold">التاريخ</th>
                <th className="px-4 py-3 font-bold">الصعوبة</th>
                <th className="px-4 py-3 font-bold">التلميح</th>
                <th className="px-4 py-3 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-laqi-border">
              {mockWords.map((w) => (
                <tr key={w.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-black text-laqi-text text-lg">{w.word}</td>
                  <td className="px-4 py-3 text-laqi-muted" dir="ltr">{w.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${difficultyColor[w.difficulty]}`}>
                      {difficultyLabel[w.difficulty]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-laqi-muted">{w.hint || '—'}</td>
                  <td className="px-4 py-3">
                    <button className="text-red-400 hover:text-red-300 text-xs font-bold transition-colors">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminGuard>
  )
}

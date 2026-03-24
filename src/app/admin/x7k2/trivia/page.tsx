'use client'

import { useState } from 'react'
import AdminGuard from '@/components/AdminGuard'

const categories = ['علوم', 'تاريخ', 'رياضة', 'ترفيه', 'جغرافيا', 'تقنية', 'دين', 'ثقافة عامة']

const mockQuestions = [
  { id: '1', question: 'ما عاصمة المملكة العربية السعودية؟', options: ['الرياض', 'جدة', 'مكة', 'الدمام'], answer: 0, category: 'جغرافيا', difficulty: 'easy' },
  { id: '2', question: 'كم عدد لاعبي كرة القدم في كل فريق؟', options: ['9', '10', '11', '12'], answer: 2, category: 'رياضة', difficulty: 'easy' },
]

export default function TriviaPage() {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [category, setCategory] = useState('ثقافة عامة')
  const [difficulty, setDifficulty] = useState('medium')

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-laqi-text">أسئلة التريفيا</h1>
          <p className="text-laqi-muted mt-1">{mockQuestions.length} سؤال في قاعدة البيانات</p>
        </div>

        {/* Add Question */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-black text-laqi-text">إضافة سؤال جديد</h2>

          <div>
            <label className="block text-sm text-laqi-muted mb-1.5">السؤال</label>
            <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)}
              placeholder="اكتب السؤال هنا..." className="input-dark" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt, i) => (
              <div key={i}>
                <label className="block text-sm text-laqi-muted mb-1.5 flex items-center gap-2">
                  <input type="radio" name="correct" checked={correctAnswer === i}
                    onChange={() => setCorrectAnswer(i)} className="accent-laqi-neon" />
                  الخيار {i + 1} {correctAnswer === i && <span className="text-laqi-neon text-xs">(الصحيح)</span>}
                </label>
                <input type="text" value={opt}
                  onChange={(e) => { const o = [...options]; o[i] = e.target.value; setOptions(o) }}
                  placeholder={`الخيار ${i + 1}...`} className="input-dark" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-laqi-muted mb-1.5">التصنيف</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-dark">
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-laqi-muted mb-1.5">الصعوبة</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="input-dark">
                <option value="easy">سهل</option>
                <option value="medium">متوسط</option>
                <option value="hard">صعب</option>
              </select>
            </div>
          </div>

          <button className="btn-neon px-6 py-2.5 text-sm">إضافة السؤال</button>
        </div>

        {/* Questions List */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-laqi-border">
            <h2 className="font-black text-laqi-text">الأسئلة الموجودة</h2>
          </div>
          <div className="divide-y divide-laqi-border">
            {mockQuestions.map((q) => (
              <div key={q.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-laqi-text font-bold mb-2">{q.question}</p>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((opt, i) => (
                        <span key={i} className={`px-2 py-0.5 rounded text-xs ${
                          i === q.answer
                            ? 'bg-laqi-neon/20 text-laqi-neon border border-laqi-neon/30'
                            : 'bg-laqi-darker text-laqi-muted'
                        }`}>
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-laqi-muted px-2 py-1 bg-laqi-darker rounded">{q.category}</span>
                    <button className="text-red-400 hover:text-red-300 text-xs font-bold">حذف</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}

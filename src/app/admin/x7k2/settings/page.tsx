'use client'

import { useState } from 'react'
import AdminGuard from '@/components/AdminGuard'

export default function SettingsPage() {
  const [maintenance, setMaintenance] = useState(false)
  const [games, setGames] = useState({
    wordle: true,
    liar: true,
    story: true,
    flags: true,
    trivia: true,
  })
  const [registrationOpen, setRegistrationOpen] = useState(true)

  type GameKey = keyof typeof games

  const gamesList = [
    { key: 'wordle' as GameKey, name: 'تخمين الكلمة', icon: '🔤' },
    { key: 'liar' as GameKey, name: 'من الكذاب؟', icon: '🎭' },
    { key: 'story' as GameKey, name: 'القصة التعاونية', icon: '📖' },
    { key: 'flags' as GameKey, name: 'أعلام العالم', icon: '🏳️' },
    { key: 'trivia' as GameKey, name: 'أسئلة عامة', icon: '🧠' },
  ]

  return (
    <AdminGuard>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-black text-laqi-text">إعدادات المنصة</h1>
          <p className="text-laqi-muted mt-1">تحكم في كل إعدادات لاقي</p>
        </div>

        {/* Maintenance Mode */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-laqi-text">وضع الصيانة</h2>
              <p className="text-laqi-muted text-sm mt-1">
                عند التفعيل، يظهر للمستخدمين صفحة صيانة بدلاً من الموقع
              </p>
            </div>
            <button
              onClick={() => setMaintenance(!maintenance)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                maintenance ? 'bg-red-500' : 'bg-laqi-border'
              }`}
            >
              <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                maintenance ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
          {maintenance && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              ⚠️ وضع الصيانة مفعّل — الموقع غير متاح للمستخدمين الآن
            </div>
          )}
        </div>

        {/* Registration */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-laqi-text">التسجيل مفتوح</h2>
              <p className="text-laqi-muted text-sm mt-1">السماح بإنشاء حسابات جديدة</p>
            </div>
            <button
              onClick={() => setRegistrationOpen(!registrationOpen)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                registrationOpen ? 'bg-laqi-neon' : 'bg-laqi-border'
              }`}
            >
              <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                registrationOpen ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Games Toggle */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-black text-laqi-text mb-4">تفعيل / تعطيل الألعاب</h2>
          <div className="space-y-3">
            {gamesList.map((game) => (
              <div key={game.key} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{game.icon}</span>
                  <span className="text-laqi-text font-bold">{game.name}</span>
                </div>
                <button
                  onClick={() => setGames({ ...games, [game.key]: !games[game.key] })}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                    games[game.key] ? 'bg-laqi-neon' : 'bg-laqi-border'
                  }`}
                >
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                    games[game.key] ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Change Admin Password */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-black text-laqi-text">تغيير كلمة مرور الأدمن</h2>
          <div className="space-y-3">
            <input type="password" placeholder="كلمة المرور الحالية" className="input-dark" dir="ltr" />
            <input type="password" placeholder="كلمة المرور الجديدة" className="input-dark" dir="ltr" />
            <input type="password" placeholder="تأكيد كلمة المرور" className="input-dark" dir="ltr" />
          </div>
          <button className="btn-neon px-6 py-2.5 text-sm">تغيير كلمة المرور</button>
        </div>

        <button className="btn-neon w-full py-3 text-base">
          💾 حفظ كل الإعدادات
        </button>
      </div>
    </AdminGuard>
  )
}

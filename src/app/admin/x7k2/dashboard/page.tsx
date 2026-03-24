'use client'

import AdminGuard from '@/components/AdminGuard'

const stats = [
  { label: 'إجمالي المستخدمين', value: '0', icon: '👥', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'الغرف النشطة الآن', value: '0', icon: '🎮', color: 'text-laqi-neon', bg: 'bg-laqi-neon/10' },
  { label: 'إيرادات اليوم', value: '0 ر.س', icon: '💰', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { label: 'مشتركين Pro', value: '0', icon: '⭐', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { label: 'ألعاب اليوم', value: '0', icon: '🕹️', color: 'text-red-400', bg: 'bg-red-500/10' },
  { label: 'إجمالي الإيرادات', value: '0 ر.س', icon: '📈', color: 'text-green-400', bg: 'bg-green-500/10' },
]

const topGames = [
  { name: 'تخمين الكلمة', plays: 0, icon: '🔤' },
  { name: 'من الكذاب؟', plays: 0, icon: '🎭' },
  { name: 'أسئلة عامة', plays: 0, icon: '🧠' },
  { name: 'أعلام العالم', plays: 0, icon: '🏳️' },
  { name: 'القصة التعاونية', plays: 0, icon: '📖' },
]

export default function DashboardPage() {
  return (
    <AdminGuard>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-laqi-text">لوحة الإحصائيات</h1>
          <p className="text-laqi-muted mt-1">مرحباً، هذه نظرة عامة على المنصة</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center text-2xl flex-shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-laqi-muted">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Games */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-black text-laqi-text mb-4">أكثر الألعاب شعبية</h2>
            <div className="space-y-3">
              {topGames.map((game, i) => (
                <div key={game.name} className="flex items-center gap-3">
                  <span className="text-laqi-muted text-sm w-4">{i + 1}</span>
                  <span className="text-lg">{game.icon}</span>
                  <span className="text-laqi-text text-sm flex-1">{game.name}</span>
                  <span className="text-laqi-neon text-sm font-bold">{game.plays} لعبة</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-black text-laqi-text mb-4">آخر النشاطات</h2>
            <div className="flex items-center justify-center h-32 text-laqi-muted text-sm">
              لا يوجد نشاط بعد
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}

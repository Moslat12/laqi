'use client'

import AdminGuard from '@/components/AdminGuard'

const mockRooms = [
  { id: '1', code: 'AB12CD', game: 'من الكذاب؟', icon: '🎭', host: 'gamer_sa', players: 5, maxPlayers: 8, status: 'playing', createdAt: 'منذ 5 دقائق' },
  { id: '2', code: 'XY34ZW', game: 'أسئلة عامة', icon: '🧠', host: 'pro_player', players: 3, maxPlayers: 10, status: 'waiting', createdAt: 'منذ 2 دقيقة' },
  { id: '3', code: 'QR56ST', game: 'أعلام العالم', icon: '🏳️', host: 'user99', players: 2, maxPlayers: 8, status: 'playing', createdAt: 'منذ 12 دقيقة' },
]

const gameLabels: Record<string, string> = {
  liar: 'من الكذاب؟',
  trivia: 'أسئلة عامة',
  flags: 'أعلام العالم',
  wordle: 'تخمين الكلمة',
  story: 'القصة التعاونية',
}

export default function RoomsPage() {
  return (
    <AdminGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-laqi-text">الغرف</h1>
            <p className="text-laqi-muted mt-1">{mockRooms.length} غرفة نشطة الآن</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-laqi-neon animate-pulse" />
            <span className="text-laqi-muted text-sm">مباشر</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockRooms.map((room) => (
            <div key={room.id} className="glass-card p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{room.icon}</span>
                  <div>
                    <div className="font-bold text-laqi-text">{room.game}</div>
                    <div className="text-xs text-laqi-muted font-mono" dir="ltr">{room.code}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  room.status === 'playing'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {room.status === 'playing' ? '🎮 يلعبون' : '⏳ انتظار'}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-laqi-muted">الهوست</span>
                  <span className="text-laqi-text font-bold">@{room.host}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-laqi-muted">اللاعبون</span>
                  <span className="text-laqi-neon font-bold">{room.players} / {room.maxPlayers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-laqi-muted">أُنشئت</span>
                  <span className="text-laqi-muted">{room.createdAt}</span>
                </div>
              </div>

              {/* Players Bar */}
              <div className="h-1.5 rounded-full bg-laqi-darker overflow-hidden">
                <div
                  className="h-full rounded-full bg-laqi-neon transition-all"
                  style={{ width: `${(room.players / room.maxPlayers) * 100}%` }}
                />
              </div>

              {/* Action */}
              <button className="w-full py-2 rounded-xl text-sm font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all">
                🚫 إغلاق الغرفة
              </button>
            </div>
          ))}
        </div>

        {mockRooms.length === 0 && (
          <div className="glass-card p-16 text-center text-laqi-muted">
            لا توجد غرف نشطة الآن
          </div>
        )}
      </div>
    </AdminGuard>
  )
}

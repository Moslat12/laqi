'use client'

import { useState } from 'react'
import AdminGuard from '@/components/AdminGuard'

// بيانات وهمية للعرض
const mockUsers = [
  { id: '1', username: 'gamer_sa', displayName: 'أبو فهد', email: 'user1@example.com', level: 12, coins: 150, isPro: true, status: 'active', gamesPlayed: 87, joinDate: '2026-01-15' },
  { id: '2', username: 'pro_player', displayName: 'محمد', email: 'user2@example.com', level: 5, coins: 30, isPro: false, status: 'active', gamesPlayed: 23, joinDate: '2026-02-20' },
  { id: '3', username: 'banned_user', displayName: 'عبدالله', email: 'user3@example.com', level: 3, coins: 0, isPro: false, status: 'banned', gamesPlayed: 10, joinDate: '2026-03-01' },
]

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null)
  const [coinsInput, setCoinsInput] = useState('')

  const filtered = mockUsers.filter(u =>
    u.username.includes(search) || u.displayName.includes(search) || u.email.includes(search)
  )

  return (
    <AdminGuard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-laqi-text">المستخدمون</h1>
            <p className="text-laqi-muted mt-1">{mockUsers.length} مستخدم مسجل</p>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="ابحث بالاسم أو الإيميل..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-dark max-w-md"
        />

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-laqi-border text-laqi-muted text-right">
                  <th className="px-4 py-3 font-bold">المستخدم</th>
                  <th className="px-4 py-3 font-bold">المستوى</th>
                  <th className="px-4 py-3 font-bold">الفيش</th>
                  <th className="px-4 py-3 font-bold">الألعاب</th>
                  <th className="px-4 py-3 font-bold">الحالة</th>
                  <th className="px-4 py-3 font-bold">تاريخ التسجيل</th>
                  <th className="px-4 py-3 font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-laqi-border">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-bold text-laqi-text flex items-center gap-2">
                          {user.displayName}
                          {user.isPro && <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">PRO</span>}
                        </div>
                        <div className="text-laqi-muted text-xs">@{user.username}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-laqi-neon font-bold">{user.level}</td>
                    <td className="px-4 py-3 text-yellow-400 font-bold">{user.coins} 🪙</td>
                    <td className="px-4 py-3 text-laqi-muted">{user.gamesPlayed}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        user.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.status === 'active' ? 'نشط' : 'محظور'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-laqi-muted">{user.joinDate}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-laqi-neon hover:text-laqi-neon-dim text-xs font-bold transition-colors"
                      >
                        تفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="glass-card p-8 w-full max-w-lg space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-laqi-text">{selectedUser.displayName}</h2>
                  <p className="text-laqi-muted text-sm">@{selectedUser.username} • {selectedUser.email}</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="text-laqi-muted hover:text-laqi-text text-xl">✕</button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-laqi-darker rounded-xl p-3 text-center">
                  <div className="text-laqi-neon font-black">{selectedUser.level}</div>
                  <div className="text-xs text-laqi-muted">المستوى</div>
                </div>
                <div className="bg-laqi-darker rounded-xl p-3 text-center">
                  <div className="text-yellow-400 font-black">{selectedUser.coins}</div>
                  <div className="text-xs text-laqi-muted">فيش</div>
                </div>
                <div className="bg-laqi-darker rounded-xl p-3 text-center">
                  <div className="text-laqi-text font-black">{selectedUser.gamesPlayed}</div>
                  <div className="text-xs text-laqi-muted">لعبة</div>
                </div>
              </div>

              {/* Add/Remove Coins */}
              <div>
                <label className="block text-sm text-laqi-muted mb-2">تعديل الفيش (+ إضافة / - خصم)</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={coinsInput}
                    onChange={(e) => setCoinsInput(e.target.value)}
                    placeholder="مثال: 50 أو -50"
                    className="input-dark flex-1"
                    dir="ltr"
                  />
                  <button className="btn-neon px-4 whitespace-nowrap text-sm">تطبيق</button>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  selectedUser.isPro
                    ? 'border-purple-500/50 text-purple-400 hover:bg-purple-500/10'
                    : 'border-laqi-border text-laqi-muted hover:border-purple-500/50 hover:text-purple-400'
                }`}>
                  {selectedUser.isPro ? '⭐ إلغاء Pro' : '⭐ منح Pro'}
                </button>
                <button className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  selectedUser.status === 'banned'
                    ? 'border-green-500/50 text-green-400 hover:bg-green-500/10'
                    : 'border-red-500/50 text-red-400 hover:bg-red-500/10'
                }`}>
                  {selectedUser.status === 'banned' ? '✅ فك الحظر' : '🚫 حظر'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  )
}

'use client'

import AdminGuard from '@/components/AdminGuard'

const mockTransactions = [
  { id: '1', user: 'gamer_sa', type: 'purchase', amount: 25, coins: 100, status: 'completed', date: '2026-03-23 14:30' },
  { id: '2', user: 'pro_player', type: 'subscription', amount: 19.99, coins: 0, status: 'completed', date: '2026-03-22 09:15' },
  { id: '3', user: 'user_x', type: 'purchase', amount: 10, coins: 40, status: 'failed', date: '2026-03-21 18:00' },
]

const coinPackages = [
  { id: '1', coins: 40, price: 10, label: 'حزمة صغيرة' },
  { id: '2', coins: 100, price: 25, label: 'حزمة متوسطة' },
  { id: '3', coins: 250, price: 50, label: 'حزمة كبيرة' },
  { id: '4', coins: 600, price: 100, label: 'حزمة بريميوم' },
]

export default function PaymentsPage() {
  return (
    <AdminGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-laqi-text">المدفوعات والفيش</h1>
          <p className="text-laqi-muted mt-1">إدارة الإيرادات وحزم الفيش</p>
        </div>

        {/* Revenue Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center">
            <div className="text-2xl font-black text-yellow-400">0 ر.س</div>
            <div className="text-sm text-laqi-muted mt-1">إيرادات اليوم</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-2xl font-black text-laqi-neon">0 ر.س</div>
            <div className="text-sm text-laqi-muted mt-1">إيرادات الشهر</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-2xl font-black text-purple-400">0</div>
            <div className="text-sm text-laqi-muted mt-1">اشتراكات Pro نشطة</div>
          </div>
        </div>

        {/* Coin Packages */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-black text-laqi-text mb-4">حزم الفيش</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {coinPackages.map((pkg) => (
              <div key={pkg.id} className="bg-laqi-darker rounded-xl p-4 text-center border border-laqi-border">
                <div className="text-2xl font-black text-yellow-400 mb-1">🪙 {pkg.coins}</div>
                <div className="text-sm text-laqi-text font-bold">{pkg.label}</div>
                <div className="text-laqi-neon text-sm mt-1">{pkg.price} ر.س</div>
                <button className="mt-3 w-full text-xs py-1.5 rounded-lg border border-laqi-border text-laqi-muted hover:border-laqi-neon/50 hover:text-laqi-neon transition-all">
                  تعديل
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Subscription Price */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-black text-laqi-text mb-4">اشتراك Pro</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm text-laqi-muted mb-1.5">السعر الشهري (ر.س)</label>
              <input type="number" defaultValue="19.99" className="input-dark max-w-xs" dir="ltr" />
            </div>
            <button className="btn-neon px-6 py-2.5 text-sm mt-5">حفظ</button>
          </div>
        </div>

        {/* Transactions */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-laqi-border">
            <h2 className="font-black text-laqi-text">آخر العمليات</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-laqi-border text-laqi-muted text-right">
                <th className="px-4 py-3 font-bold">المستخدم</th>
                <th className="px-4 py-3 font-bold">النوع</th>
                <th className="px-4 py-3 font-bold">المبلغ</th>
                <th className="px-4 py-3 font-bold">الفيش</th>
                <th className="px-4 py-3 font-bold">الحالة</th>
                <th className="px-4 py-3 font-bold">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-laqi-border">
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-bold text-laqi-text">@{tx.user}</td>
                  <td className="px-4 py-3 text-laqi-muted">
                    {tx.type === 'purchase' ? '🪙 شراء فيش' : '⭐ اشتراك Pro'}
                  </td>
                  <td className="px-4 py-3 text-yellow-400 font-bold">{tx.amount} ر.س</td>
                  <td className="px-4 py-3 text-laqi-muted">{tx.coins || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      tx.status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {tx.status === 'completed' ? 'ناجحة' : 'فاشلة'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-laqi-muted text-xs" dir="ltr">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminGuard>
  )
}

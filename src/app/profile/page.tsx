import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// بيانات وهمية للعرض
const mockProfile = {
  username: 'gamer_sa',
  displayName: 'أبو فهد',
  level: 12,
  xp: 2450,
  xpToNext: 3000,
  coins: 150,
  isPro: false,
  gamesPlayed: 87,
  gamesWon: 34,
  winRate: 39,
}

const recentGames = [
  { game: 'تخمين الكلمة', result: 'فوز', score: 120, date: 'اليوم' },
  { game: 'من الكذاب؟', result: 'خسارة', score: 45, date: 'أمس' },
  { game: 'أسئلة عامة', result: 'فوز', score: 200, date: 'أمس' },
  { game: 'أعلام العالم', result: 'فوز', score: 180, date: 'قبل يومين' },
]

export default function ProfilePage() {
  const xpPercentage = (mockProfile.xp / mockProfile.xpToNext) * 100

  return (
    <main className="min-h-screen bg-laqi-dark">
      <Navbar />

      <section className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="glass-card p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-laqi-neon/20 border-2 border-laqi-neon flex items-center justify-center text-4xl">
                👤
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-start">
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <h1 className="text-2xl font-black text-laqi-text">{mockProfile.displayName}</h1>
                  {mockProfile.isPro && (
                    <span className="px-2 py-0.5 rounded-full bg-laqi-purple/20 text-laqi-purple text-xs font-bold">PRO</span>
                  )}
                </div>
                <p className="text-laqi-muted">@{mockProfile.username}</p>

                {/* XP Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-laqi-neon font-bold">مستوى {mockProfile.level}</span>
                    <span className="text-laqi-muted">{mockProfile.xp} / {mockProfile.xpToNext} XP</span>
                  </div>
                  <div className="h-2 rounded-full bg-laqi-darker overflow-hidden">
                    <div
                      className="h-full rounded-full bg-laqi-neon transition-all duration-500"
                      style={{ width: `${xpPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Coins */}
              <div className="text-center px-6 py-4 rounded-xl bg-laqi-darker border border-laqi-border">
                <div className="text-2xl font-black text-laqi-yellow">{mockProfile.coins}</div>
                <div className="text-xs text-laqi-muted">فيش</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-black text-laqi-neon">{mockProfile.gamesPlayed}</div>
              <div className="text-sm text-laqi-muted mt-1">لعبة</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-black text-laqi-neon">{mockProfile.gamesWon}</div>
              <div className="text-sm text-laqi-muted mt-1">فوز</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-black text-laqi-neon">{mockProfile.winRate}%</div>
              <div className="text-sm text-laqi-muted mt-1">نسبة الفوز</div>
            </div>
          </div>

          {/* Recent Games */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold text-laqi-text mb-6">آخر الألعاب</h2>
            <div className="space-y-3">
              {recentGames.map((game, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-laqi-darker">
                  <div className="flex-1">
                    <div className="font-bold text-laqi-text">{game.game}</div>
                    <div className="text-xs text-laqi-muted">{game.date}</div>
                  </div>
                  <div className="text-sm font-bold text-laqi-muted">+{game.score} XP</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    game.result === 'فوز'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {game.result}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

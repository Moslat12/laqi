import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GameCard from '@/components/GameCard'
import Link from 'next/link'

const games = [
  {
    title: 'تخمين الكلمة',
    description: 'خمّن الكلمة العربية في 6 محاولات. كل يوم كلمة جديدة! اختبر حصيلتك اللغوية.',
    icon: '🔤',
    players: 'فردي / تحدي',
    color: 'bg-green-500/20',
    href: '/games/wordle',
    status: 'العب الآن',
  },
  {
    title: 'من الكذاب؟',
    description: 'كل اللاعبين يحصلون على نفس الموضوع إلا واحد! اكتشف من الكذاب قبل لا يكتشفونك.',
    icon: '🎭',
    players: '3 - 8 لاعبين',
    color: 'bg-purple-500/20',
    href: '/games/liar',
    status: 'العب الآن',
  },
  {
    title: 'القصة التعاونية',
    description: 'كل لاعب يضيف جملة والقصة تتشكل! شوف وين توصل القصة مع ربعك.',
    icon: '📖',
    players: '2 - 10 لاعبين',
    color: 'bg-blue-500/20',
    href: '/games/story',
    status: 'العب الآن',
  },
  {
    title: 'أعلام العالم',
    description: 'نعرض لك علم دولة وأنت تخمّن اسمها. كل ما خمّنت أسرع كل ما نقاطك أكثر!',
    icon: '🏳️',
    players: 'فردي / جماعي',
    color: 'bg-yellow-500/20',
    href: '/games/flags',
    status: 'العب الآن',
  },
  {
    title: 'أسئلة عامة',
    description: 'أسئلة متنوعة في كل المجالات. تنافس مع ربعك ووريهم من الأذكى!',
    icon: '🧠',
    players: '2 - 20 لاعب',
    color: 'bg-red-500/20',
    href: '/games/trivia',
    status: 'العب الآن',
  },
]

export default function GamesPage() {
  return (
    <main className="min-h-screen bg-laqi-dark">
      <Navbar />

      <section className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-laqi-text mb-4">
              الألعاب
            </h1>
            <p className="text-laqi-muted max-w-lg mx-auto text-lg">
              اختر لعبتك وابدأ المتعة مع ربعك
            </p>
          </div>

          {/* Quick Join */}
          <div className="max-w-md mx-auto mb-12">
            <div className="glass-card p-4 flex gap-3">
              <input
                type="text"
                placeholder="ادخل كود الغرفة..."
                className="input-dark flex-1 text-center tracking-widest text-lg"
                maxLength={6}
                dir="ltr"
              />
              <button className="btn-neon whitespace-nowrap">
                انضم
              </button>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Link key={game.title} href={game.href} className="relative block">
                <GameCard {...game} />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-laqi-neon/10 border border-laqi-neon/20 text-laqi-neon text-xs">
                  {game.status}
                </div>
              </Link>
            ))}
          </div>

          {/* Create Room CTA */}
          <div className="text-center mt-12">
            <Link href="/room" className="btn-neon-outline text-lg px-8 py-4">
              أنشئ غرفة جديدة
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

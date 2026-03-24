import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GameCard from '@/components/GameCard'
import Link from 'next/link'

const games = [
  {
    title: 'تخمين الكلمة',
    description: 'خمّن الكلمة العربية في 6 محاولات. كل يوم كلمة جديدة!',
    icon: '🔤',
    players: 'فردي / تحدي',
    color: 'bg-green-500/20',
    href: '/games/wordle',
  },
  {
    title: 'من الكذاب؟',
    description: 'واحد يكذب والباقين يحاولون يكشفونه. من تشك فيه؟',
    icon: '🎭',
    players: '3 - 8 لاعبين',
    color: 'bg-purple-500/20',
    href: '/games/liar',
  },
  {
    title: 'القصة التعاونية',
    description: 'كل لاعب يضيف جملة بالدور. شوف وين توصل القصة!',
    icon: '📖',
    players: '2 - 10 لاعبين',
    color: 'bg-blue-500/20',
    href: '/games/story',
  },
  {
    title: 'أعلام العالم',
    description: 'شوف العلم وخمّن الدولة. اختبر معلوماتك الجغرافية!',
    icon: '🏳️',
    players: 'فردي / جماعي',
    color: 'bg-yellow-500/20',
    href: '/games/flags',
  },
  {
    title: 'أسئلة عامة',
    description: 'تنافس مع ربعك في أسئلة معلومات عامة متنوعة.',
    icon: '🧠',
    players: '2 - 20 لاعب',
    color: 'bg-red-500/20',
    href: '/games/trivia',
  },
]

const features = [
  {
    icon: '⚡',
    title: 'سريع وخفيف',
    description: 'يشتغل على الجوال والكمبيوتر بدون تحميل',
  },
  {
    icon: '🎮',
    title: 'ألعاب متنوعة',
    description: '5 ألعاب مختلفة تناسب كل الأذواق',
  },
  {
    icon: '👥',
    title: 'العب مع ربعك',
    description: 'ادعُ أصحابك بكود وابدأوا اللعب فوراً',
  },
  {
    icon: '🏆',
    title: 'تنافس وتصدّر',
    description: 'اجمع نقاط وتصدّر ليدربورد',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-laqi-dark">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="absolute inset-0 bg-dots opacity-30" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-laqi-neon/10 border border-laqi-neon/20 text-laqi-neon text-sm mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-laqi-neon animate-pulse" />
            منصة ألعاب عربية جديدة
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl font-black mb-6 animate-slide-up">
            <span className="text-laqi-text">العب مع </span>
            <span className="text-laqi-neon text-neon-glow">ربعك</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-laqi-muted max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed">
            ألعاب كتابية جماعية بالعربي. ادخل، ادعُ أصحابك، والعبوا مع بعض!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link href="/games" className="btn-neon text-lg px-8 py-4 w-full sm:w-auto">
              ابدأ اللعب
            </Link>
            <Link href="/room" className="btn-neon-outline text-lg px-8 py-4 w-full sm:w-auto">
              ادخل غرفة
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-16 mt-16 animate-fade-in">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-laqi-neon">5</div>
              <div className="text-sm text-laqi-muted">ألعاب</div>
            </div>
            <div className="w-px h-10 bg-laqi-border" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-laqi-neon">∞</div>
              <div className="text-sm text-laqi-muted">مرح</div>
            </div>
            <div className="w-px h-10 bg-laqi-border" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-laqi-neon">0</div>
              <div className="text-sm text-laqi-muted">تحميل</div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-20 px-4" id="games">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-laqi-text mb-4">
              الألعاب
            </h2>
            <p className="text-laqi-muted max-w-lg mx-auto">
              اختر لعبتك المفضلة وابدأ التحدي مع ربعك
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard key={game.title} {...game} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-laqi-darker/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-laqi-text mb-4">
              ليش لاقي؟
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-laqi-text mb-2">{feature.title}</h3>
                <p className="text-sm text-laqi-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card p-10">
            <h2 className="text-3xl font-black text-laqi-text mb-4">
              جاهز تلعب؟
            </h2>
            <p className="text-laqi-muted mb-8">
              سجّل حسابك وابدأ اللعب مع ربعك الحين!
            </p>
            <Link href="/auth" className="btn-neon text-lg px-8 py-4">
              سجّل مجاناً
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

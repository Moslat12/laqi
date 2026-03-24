import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const values = [
  { icon: '🎮', title: 'المتعة أولاً', description: 'صممنا لاقي عشان تجمع ربعك وتمضوا وقت ممتع بدون تعقيد.' },
  { icon: '🌍', title: 'هوية عربية', description: 'منصة مصممة خصيصاً للمجتمع العربي، بلغتهم وثقافتهم.' },
  { icon: '⚡', title: 'بساطة وسرعة', description: 'بدون تحميل، بدون تعقيد. افتح الموقع والعب فوراً.' },
  { icon: '🤝', title: 'مجتمع نظيف', description: 'بيئة آمنة وممتعة للجميع، نحرص على تجربة إيجابية للكل.' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-laqi-dark">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-black mb-6">
            <span className="text-laqi-text">عن </span>
            <span className="text-laqi-neon text-neon-glow font-qahwa">لاقي</span>
          </h1>
          <p className="text-laqi-muted text-xl leading-relaxed">
            منصة ألعاب كتابية جماعية، صُنعت بحب للمجتمع العربي
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-10">
            <div className="space-y-4 text-laqi-muted leading-relaxed text-lg">
              <p>
                لاقي منصة ألعاب جماعية عربية، هدفها بسيط:
              </p>
              <p>
                تجمعك مع أخوياك في مكان واحد تلعبون وتستانسون بدون تحميل أو تعقيد.
              </p>
              <p>
                سوّ روم، ادخل مع أخوياك، وابدأ التحدي.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-laqi-text text-center mb-12">قيمنا</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="game-card flex gap-5 items-start">
                <div className="text-4xl flex-shrink-0">{v.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-laqi-text mb-2">{v.title}</h3>
                  <p className="text-laqi-muted text-sm leading-relaxed">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-10 text-center">
            <h2 className="text-2xl font-black text-laqi-text mb-4">تواصل معنا</h2>
            <p className="text-laqi-muted mb-8">عندك اقتراح أو ملاحظة؟ نبي نسمع منك!</p>
            <a href="mailto:hello@laqi.gg" className="btn-neon text-lg px-8 py-4 inline-block">
              راسلنا
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

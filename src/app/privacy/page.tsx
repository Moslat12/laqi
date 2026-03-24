import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const sections = [
  {
    title: '1. المعلومات التي نجمعها',
    content: [
      'عند إنشاء حساب: الاسم، البريد الإلكتروني، اسم المستخدم.',
      'بيانات اللعب: النقاط، الألعاب، الغرف التي انضممت إليها.',
      'بيانات تقنية: نوع الجهاز والمتصفح، لتحسين تجربتك.',
    ],
  },
  {
    title: '2. كيف نستخدم معلوماتك',
    content: [
      'تشغيل حسابك وحفظ تقدمك في الألعاب.',
      'إرسال إشعارات تخص حسابك أو تحديثات المنصة.',
      'تحسين المنصة وإصلاح المشاكل التقنية.',
      'نظام الفيش والمدفوعات عبر بوابة Moyasar الآمنة.',
    ],
  },
  {
    title: '3. مشاركة المعلومات',
    content: [
      'لا نبيع بياناتك لأي طرف ثالث، أبداً.',
      'نشارك فقط ما يلزم مع مزودي الخدمة (Supabase وMoyasar).',
      'قد نُفصح عن المعلومات إذا طلب ذلك قانونياً.',
    ],
  },
  {
    title: '4. الأمان',
    content: [
      'نستخدم تشفير SSL لحماية بياناتك أثناء النقل.',
      'كلمات المرور مشفّرة ولا يمكن لأحد من فريقنا رؤيتها.',
      'المدفوعات عبر Moyasar المعتمد ولا نحتفظ بأي بيانات بنكية.',
    ],
  },
  {
    title: '5. ملفات الكوكيز',
    content: [
      'نستخدم كوكيز ضرورية فقط لتشغيل الجلسة وتسجيل الدخول.',
      'لا نستخدم كوكيز تتبع أو إعلانية.',
    ],
  },
  {
    title: '6. حقوقك',
    content: [
      'يحق لك طلب نسخة من بياناتك في أي وقت.',
      'يحق لك طلب حذف حسابك وبياناتك كاملاً.',
      'يحق لك تعديل معلوماتك الشخصية من صفحة الحساب.',
      'لأي طلب تواصل معنا على hello@laqi.gg',
    ],
  },
  {
    title: '7. الأطفال',
    content: [
      'لاقي مخصص للمستخدمين من عمر 13 سنة فأكثر.',
      'إذا علمنا بوجود بيانات لطفل دون 13 سنة، نحذفها فوراً.',
    ],
  },
  {
    title: '8. التحديثات',
    content: [
      'قد نحدّث هذه السياسة من وقت لآخر.',
      'سنخبرك بأي تغيير جوهري عبر البريد الإلكتروني أو إشعار في المنصة.',
      'استمرارك في استخدام لاقي بعد التحديث يعني موافقتك.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-laqi-dark">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-4">
            <span className="text-laqi-text">سياسة </span>
            <span className="text-laqi-neon text-neon-glow">الخصوصية</span>
          </h1>
          <p className="text-laqi-muted text-lg">آخر تحديث: مارس 2026</p>
        </div>
      </section>

      {/* Intro */}
      <section className="pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-8">
            <p className="text-laqi-muted leading-relaxed text-lg">
              خصوصيتك تهمنا. هذه الصفحة تشرح ما نجمعه من بيانات عند استخدامك لمنصة لاقي،
              وكيف نستخدمها، وكيف نحميها. نحن نؤمن بالشفافية الكاملة مع مستخدمينا.
            </p>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-8 pb-20 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="game-card">
              <h2 className="text-xl font-black text-laqi-text mb-4">{section.title}</h2>
              <ul className="space-y-3">
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-laqi-muted leading-relaxed">
                    <span className="text-laqi-neon mt-1 flex-shrink-0">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="glass-card p-8 text-center">
            <h2 className="text-xl font-black text-laqi-text mb-3">أسئلة؟</h2>
            <p className="text-laqi-muted mb-6">
              إذا عندك أي استفسار عن خصوصيتك، تواصل معنا مباشرة.
            </p>
            <a href="mailto:hello@laqi.gg" className="btn-neon px-8 py-3 inline-block">
              hello@laqi.gg
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

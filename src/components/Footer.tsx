import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-laqi-border bg-laqi-darker py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-laqi-neon">لاقي</span>
            <span className="text-laqi-muted text-sm">— العب مع ربعك</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-laqi-muted">
            <Link href="/games" className="hover:text-laqi-neon transition-colors">الألعاب</Link>
            <Link href="/about" className="hover:text-laqi-neon transition-colors">عن لاقي</Link>
            <Link href="/privacy" className="hover:text-laqi-neon transition-colors">الخصوصية</Link>
          </div>
          <p className="text-laqi-muted text-sm">
            &copy; {new Date().getFullYear()} لاقي. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  )
}

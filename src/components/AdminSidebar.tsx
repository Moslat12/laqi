'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin/x7k2/dashboard',      icon: '📊', label: 'الإحصائيات' },
  { href: '/admin/x7k2/users',          icon: '👥', label: 'المستخدمون' },
  { href: '/admin/x7k2/rooms',          icon: '🎮', label: 'الغرف' },
  { href: '/admin/x7k2/wordle',         icon: '🔤', label: 'كلمات Wordle' },
  { href: '/admin/x7k2/trivia',         icon: '🧠', label: 'أسئلة التريفيا' },
  { href: '/admin/x7k2/payments',       icon: '💰', label: 'المدفوعات' },
  { href: '/admin/x7k2/notifications',  icon: '📢', label: 'الإشعارات' },
  { href: '/admin/x7k2/settings',       icon: '⚙️', label: 'الإعدادات' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem('laqi_admin')
    router.push('/admin/x7k2')
  }

  return (
    <aside className="w-64 min-h-screen bg-laqi-darker border-l border-laqi-border flex flex-col fixed right-0 top-0 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-laqi-border">
        <span className="text-2xl font-qahwa text-laqi-neon text-neon-glow">لاقي</span>
        <p className="text-xs text-laqi-muted mt-1">لوحة التحكم</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                isActive
                  ? 'bg-laqi-neon/10 text-laqi-neon border border-laqi-neon/20'
                  : 'text-laqi-muted hover:text-laqi-text hover:bg-white/5'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && <span className="mr-auto w-1.5 h-1.5 rounded-full bg-laqi-neon" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-laqi-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
        >
          <span>🚪</span>
          <span>تسجيل خروج</span>
        </button>
      </div>
    </aside>
  )
}

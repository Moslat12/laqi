'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// كلمة المرور — غيّرها لشي تعرفه
const ADMIN_PASSWORD = 'laqi@admin2026'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // حفظ الجلسة
        sessionStorage.setItem('laqi_admin', 'true')
        router.push('/admin/x7k2/dashboard')
      } else {
        setError(true)
        setLoading(false)
      }
    }, 600)
  }

  return (
    <main className="min-h-screen bg-laqi-dark flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-gradient-radial" />
      <div className="fixed inset-0 bg-dots opacity-20" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl font-qahwa text-laqi-neon text-neon-glow">لاقي</span>
          <p className="text-laqi-muted mt-2 text-sm">لوحة التحكم</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <h1 className="text-xl font-black text-laqi-text text-center mb-6">دخول المشرف</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-laqi-muted mb-1.5">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input-dark text-center tracking-widest"
                dir="ltr"
                autoFocus
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">كلمة المرور غلط</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-neon w-full py-3 text-base"
            >
              {loading ? '...' : 'دخول'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

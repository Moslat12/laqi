'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: ربط مع Supabase Auth
    console.log(isLogin ? 'تسجيل دخول' : 'حساب جديد', { email, password, username })
  }

  return (
    <main className="min-h-screen bg-laqi-dark flex items-center justify-center px-4">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-radial" />
      <div className="fixed inset-0 bg-dots opacity-20" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-4xl font-black text-laqi-neon text-neon-glow">
              لاقي
            </span>
          </Link>
          <p className="text-laqi-muted mt-2">
            {isLogin ? 'أهلاً فيك مرة ثانية!' : 'انضم لنا واستمتع مع ربعك'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card p-8">
          {/* Toggle */}
          <div className="flex bg-laqi-darker rounded-xl p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                isLogin
                  ? 'bg-laqi-neon text-laqi-dark'
                  : 'text-laqi-muted hover:text-laqi-text'
              }`}
            >
              دخول
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                !isLogin
                  ? 'bg-laqi-neon text-laqi-dark'
                  : 'text-laqi-muted hover:text-laqi-text'
              }`}
            >
              حساب جديد
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-laqi-muted mb-1.5">اسم المستخدم</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="مثال: gamer_sa"
                  className="input-dark"
                  dir="ltr"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-laqi-muted mb-1.5">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="input-dark"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-laqi-muted mb-1.5">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-dark"
                dir="ltr"
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-neon w-full text-lg py-3.5 mt-2">
              {isLogin ? 'دخول' : 'سجّل حساب'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-laqi-border" />
            <span className="text-laqi-muted text-xs">أو</span>
            <div className="flex-1 h-px bg-laqi-border" />
          </div>

          {/* Social Login */}
          <button className="w-full py-3 rounded-xl border border-laqi-border bg-laqi-darker text-laqi-text hover:border-laqi-neon/30 transition-all flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            تسجيل بحساب Google
          </button>
        </div>

        {/* Back */}
        <div className="text-center mt-6">
          <Link href="/" className="text-laqi-muted text-sm hover:text-laqi-neon transition-colors">
            الرجوع للرئيسية
          </Link>
        </div>
      </div>
    </main>
  )
}

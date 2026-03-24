'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-laqi-darker/80 backdrop-blur-lg border-b border-laqi-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl font-qahwa text-laqi-neon text-neon-glow">
              لاقي
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/games" className="text-laqi-muted hover:text-laqi-neon transition-colors">
              الألعاب
            </Link>
            <Link href="/room" className="text-laqi-muted hover:text-laqi-neon transition-colors">
              الغرف
            </Link>
            <Link href="/profile" className="text-laqi-muted hover:text-laqi-neon transition-colors">
              حسابي
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth" className="btn-neon-outline text-sm px-4 py-2">
              دخول
            </Link>
            <Link href="/auth" className="btn-neon text-sm px-4 py-2">
              حساب جديد
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-laqi-text p-2"
            aria-label="القائمة"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-laqi-border animate-slide-up">
            <div className="flex flex-col gap-4">
              <Link href="/games" className="text-laqi-muted hover:text-laqi-neon transition-colors">
                الألعاب
              </Link>
              <Link href="/room" className="text-laqi-muted hover:text-laqi-neon transition-colors">
                الغرف
              </Link>
              <Link href="/profile" className="text-laqi-muted hover:text-laqi-neon transition-colors">
                حسابي
              </Link>
              <div className="flex gap-3 pt-2">
                <Link href="/auth" className="btn-neon-outline text-sm px-4 py-2 text-center flex-1">
                  دخول
                </Link>
                <Link href="/auth" className="btn-neon text-sm px-4 py-2 text-center flex-1">
                  حساب جديد
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

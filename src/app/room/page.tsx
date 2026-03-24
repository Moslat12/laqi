'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const gameTypes = [
  { id: 'wordle', name: 'تخمين الكلمة', icon: '🔤', maxPlayers: 2 },
  { id: 'liar', name: 'من الكذاب؟', icon: '🎭', maxPlayers: 8 },
  { id: 'story', name: 'القصة التعاونية', icon: '📖', maxPlayers: 10 },
  { id: 'flags', name: 'أعلام العالم', icon: '🏳️', maxPlayers: 8 },
  { id: 'trivia', name: 'أسئلة عامة', icon: '🧠', maxPlayers: 20 },
]

export default function RoomPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [joinCode, setJoinCode] = useState('')

  return (
    <main className="min-h-screen bg-laqi-dark">
      <Navbar />

      <section className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black text-laqi-text text-center mb-12">
            الغرف
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Join Room */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-laqi-text mb-2">انضم لغرفة</h2>
              <p className="text-laqi-muted mb-6">عندك كود؟ ادخله وانضم لربعك</p>

              <div className="space-y-4">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="ABCDEF"
                  className="input-dark text-center text-2xl tracking-[0.5em] font-bold"
                  maxLength={6}
                  dir="ltr"
                />
                <button
                  className="btn-neon w-full text-lg py-3.5"
                  disabled={joinCode.length !== 6}
                >
                  انضم للغرفة
                </button>
              </div>
            </div>

            {/* Create Room */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-laqi-text mb-2">أنشئ غرفة</h2>
              <p className="text-laqi-muted mb-6">اختر لعبة وادعُ ربعك</p>

              <div className="space-y-3 mb-6">
                {gameTypes.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => setSelectedGame(game.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      selectedGame === game.id
                        ? 'border-laqi-neon bg-laqi-neon/10 text-laqi-neon'
                        : 'border-laqi-border bg-laqi-darker text-laqi-text hover:border-laqi-neon/30'
                    }`}
                  >
                    <span className="text-xl">{game.icon}</span>
                    <span className="font-bold flex-1 text-start">{game.name}</span>
                    <span className="text-xs text-laqi-muted">حتى {game.maxPlayers}</span>
                  </button>
                ))}
              </div>

              <button
                className="btn-neon w-full text-lg py-3.5"
                disabled={!selectedGame}
              >
                أنشئ الغرفة
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

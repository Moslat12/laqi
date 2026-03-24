'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createRoom, joinRoom } from '@/lib/roomService'
import { useRoom } from '@/hooks/useRoom'
import { updateRoomStatus } from '@/lib/roomService'

interface GameLobbyProps {
  gameType: string
  gameName: string
  gameEmoji: string
  minPlayers?: number
  onStart: (roomCode: string, playerId: string) => void
}

// ============================================================
// شاشة الإعداد — إنشاء أو انضمام
// ============================================================
export function GameSetup({ gameType, gameName, gameEmoji, minPlayers = 2, onStart }: GameLobbyProps) {
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose')
  const [nickname, setNickname] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate() {
    if (!nickname.trim()) { setError('ادخل اسمك أولاً'); return }
    setLoading(true); setError('')
    try {
      const { room, playerId } = await createRoom(gameType, nickname.trim())
      onStart(room.code, playerId)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'حدث خطأ')
    }
    setLoading(false)
  }

  async function handleJoin() {
    if (!nickname.trim()) { setError('ادخل اسمك أولاً'); return }
    if (joinCode.trim().length < 4) { setError('ادخل كود الغرفة'); return }
    setLoading(true); setError('')
    try {
      const { room, playerId } = await joinRoom(joinCode.trim(), nickname.trim())
      onStart(room.code, playerId)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'حدث خطأ')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-laqi-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{gameEmoji}</div>
          <h1 className="text-3xl font-black text-laqi-neon mb-2">{gameName}</h1>
          <p className="text-laqi-muted">كل لاعب على جهازه الخاص</p>
        </div>

        {mode === 'choose' && (
          <div className="glass-card p-6 space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full btn-neon py-4 text-lg"
            >
              🎮 أنشئ غرفة جديدة
            </button>
            <button
              onClick={() => setMode('join')}
              className="w-full btn-neon-outline py-4 text-lg"
            >
              🔗 انضم لغرفة موجودة
            </button>
          </div>
        )}

        {(mode === 'create' || mode === 'join') && (
          <div className="glass-card p-6 space-y-4">
            <button
              onClick={() => { setMode('choose'); setError('') }}
              className="text-laqi-muted hover:text-laqi-text text-sm flex items-center gap-1 mb-2"
            >
              ← رجوع
            </button>

            <div>
              <label className="text-laqi-muted text-sm mb-2 block">اسمك في اللعبة</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="مثال: محمد، سلمى..."
                className="input-dark w-full text-center text-lg"
                maxLength={20}
              />
            </div>

            {mode === 'join' && (
              <div>
                <label className="text-laqi-muted text-sm mb-2 block">كود الغرفة</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="XXXXXX"
                  className="input-dark w-full text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  dir="ltr"
                />
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg p-2">{error}</p>
            )}

            <button
              onClick={mode === 'create' ? handleCreate : handleJoin}
              disabled={loading}
              className="w-full btn-neon py-4 text-lg disabled:opacity-50"
            >
              {loading ? '...' : mode === 'create' ? '🚀 إنشاء الغرفة' : '✅ انضم الآن'}
            </button>

            {minPlayers > 1 && mode === 'create' && (
              <p className="text-laqi-muted text-xs text-center">
                تحتاج على الأقل {minPlayers} لاعبين لبدء اللعبة
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// الـ Lobby — انتظار اللاعبين
// ============================================================
interface LobbyProps {
  roomCode: string
  playerId: string
  minPlayers?: number
  onGameStart: () => void
}

export function GameWaitingRoom({ roomCode, playerId, minPlayers = 2, onGameStart }: LobbyProps) {
  const { room, loading, isHost } = useRoom(roomCode)
  const [starting, setStarting] = useState(false)
  const router = useRouter()

  // عندما تبدأ اللعبة
  if (room?.status === 'playing') {
    onGameStart()
  }

  async function handleStart() {
    if (!room) return
    setStarting(true)
    try {
      await updateRoomStatus(roomCode, 'playing')
    } catch {
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-laqi-dark flex items-center justify-center">
        <div className="text-laqi-neon text-xl animate-pulse">جاري التحميل...</div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-laqi-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">الغرفة غير موجودة</p>
          <button onClick={() => router.push('/games')} className="btn-neon">العودة للألعاب</button>
        </div>
      </div>
    )
  }

  const players = room.players || []
  const canStart = isHost && players.length >= minPlayers

  return (
    <div className="min-h-screen bg-laqi-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* كود الغرفة */}
        <div className="glass-card p-6 text-center mb-6">
          <p className="text-laqi-muted text-sm mb-2">شارك هذا الكود مع ربعك</p>
          <div className="text-5xl font-black text-laqi-neon tracking-widest font-mono mb-3" dir="ltr">
            {roomCode}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(roomCode)}
            className="text-laqi-muted hover:text-laqi-neon text-sm transition-colors"
          >
            📋 انسخ الكود
          </button>
        </div>

        {/* قائمة اللاعبين */}
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-laqi-text font-bold">اللاعبون ({players.length})</h3>
            <div className="flex gap-1">
              {Array.from({ length: minPlayers }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${i < players.length ? 'bg-laqi-neon' : 'bg-laqi-card'}`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {players.map((p) => (
              <div
                key={p.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  p.id === playerId ? 'bg-laqi-neon/10 border border-laqi-neon/30' : 'bg-laqi-card'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-laqi-neon/20 flex items-center justify-center text-laqi-neon font-bold">
                  {p.nickname[0]}
                </div>
                <span className="text-laqi-text font-medium flex-1">{p.nickname}</span>
                {p.isHost && (
                  <span className="text-xs text-laqi-neon bg-laqi-neon/10 px-2 py-0.5 rounded-full">هوست</span>
                )}
                {p.id === playerId && (
                  <span className="text-xs text-laqi-muted">(أنت)</span>
                )}
              </div>
            ))}
          </div>
          {players.length < minPlayers && (
            <p className="text-laqi-muted text-sm text-center mt-3">
              في انتظار {minPlayers - players.length} لاعب أو أكثر...
            </p>
          )}
        </div>

        {/* زر البداية */}
        {isHost ? (
          <button
            onClick={handleStart}
            disabled={!canStart || starting}
            className="w-full btn-neon py-4 text-lg disabled:opacity-40"
          >
            {starting ? 'جاري التحضير...' : canStart ? '🚀 ابدأ اللعبة' : `في انتظار اللاعبين...`}
          </button>
        ) : (
          <div className="glass-card p-4 text-center">
            <p className="text-laqi-muted animate-pulse">في انتظار الهوست لبدء اللعبة...</p>
          </div>
        )}
      </div>
    </div>
  )
}

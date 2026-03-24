'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GameSetup, GameWaitingRoom } from '@/components/GameLobby'
import { useRoom } from '@/hooks/useRoom'
import { updateRoomState } from '@/lib/roomService'

const STARTERS = [
  'في ليلة مظلمة وعاصفة، كان هناك...',
  'لم يتوقع أحد ما سيحدث ذلك الصباح، عندما...',
  'في مدينة صغيرة نسيها الجميع، يعيش...',
  'وصل البريد مبكراً هذا اليوم، وفيه رسالة غريبة تقول...',
  'كانت الرحلة مجرد فكرة عشوائية، لكن...',
]

type Phase = 'lobby' | 'waiting' | 'playing'

export default function StoryPage() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)

  function handleSetupDone(code: string, pid: string) {
    setRoomCode(code); setPlayerId(pid); setPhase('waiting')
  }

  if (phase === 'lobby') return (
    <GameSetup gameType="story" gameName="القصة التعاونية" gameEmoji="📖" minPlayers={2} onStart={handleSetupDone} />
  )
  if (phase === 'waiting' && roomCode && playerId) return (
    <GameWaitingRoom roomCode={roomCode} playerId={playerId} minPlayers={2} onGameStart={() => setPhase('playing')} />
  )
  if (phase === 'playing' && roomCode && playerId) return (
    <StoryGame roomCode={roomCode} playerId={playerId} />
  )
  return null
}

function StoryGame({ roomCode, playerId }: { roomCode: string; playerId: string }) {
  const { room, isHost } = useRoom(roomCode)
  const [mySentence, setMySentence] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const gs = (room?.game_state || {}) as Record<string, unknown>
  const gamePhase = (gs.phase as string) || 'init'
  const sentences = (gs.sentences as Array<{ playerId: string; nickname: string; text: string }>) || []
  const currentTurnId = gs.currentTurn as string
  const starter = gs.starter as string
  const players = room?.players || []
  const maxSentences = players.length * 3 // 3 جولات لكل لاعب

  const isMyTurn = currentTurnId === playerId
  const me = players.find(p => p.id === playerId)

  // الهوست: تجهيز اللعبة
  if (isHost && gamePhase === 'init' && room) {
    const s = STARTERS[Math.floor(Math.random() * STARTERS.length)]
    const firstPlayer = players[0]
    updateRoomState(roomCode, {
      phase: 'writing',
      starter: s,
      sentences: [],
      currentTurn: firstPlayer?.id,
    })
  }

  async function submitSentence() {
    if (!mySentence.trim() || submitting || !isMyTurn) return
    setSubmitting(true)

    const newSentences = [...sentences, {
      playerId,
      nickname: me?.nickname || '؟',
      text: mySentence.trim(),
    }]

    // الدور التالي
    const currentIdx = players.findIndex(p => p.id === currentTurnId)
    const nextIdx = (currentIdx + 1) % players.length
    const nextPlayer = players[nextIdx]

    const isFinished = newSentences.length >= maxSentences

    await updateRoomState(roomCode, {
      ...gs,
      sentences: newSentences,
      currentTurn: isFinished ? null : nextPlayer?.id,
      phase: isFinished ? 'result' : 'writing',
    })
    setMySentence('')
    setSubmitting(false)
  }

  if (!room || gamePhase === 'init') return (
    <div className="min-h-screen bg-laqi-dark flex items-center justify-center">
      <div className="text-laqi-neon text-xl animate-pulse">جاري تجهيز القصة...</div>
    </div>
  )

  const currentTurnPlayer = players.find(p => p.id === currentTurnId)

  // ==================== مرحلة الكتابة ====================
  if (gamePhase === 'writing') {
    return (
      <div className="min-h-screen bg-laqi-dark flex flex-col p-4 pt-6">
        <div className="max-w-lg mx-auto w-full flex flex-col h-full">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-black text-laqi-neon">القصة التعاونية</h2>
            <p className="text-laqi-muted text-sm">{sentences.length} / {maxSentences} جملة</p>
          </div>

          {/* القصة حتى الآن */}
          <div className="glass-card p-4 flex-1 overflow-y-auto mb-4 min-h-0">
            <p className="text-laqi-neon text-sm mb-3 font-bold">البداية: <span className="text-laqi-muted">{starter}</span></p>
            {sentences.map((s, i) => (
              <div key={i} className={`mb-3 ${s.playerId === playerId ? 'text-laqi-neon' : 'text-laqi-text'}`}>
                <span className="text-xs text-laqi-muted">{s.nickname}: </span>
                <span className="text-sm leading-relaxed">{s.text}</span>
              </div>
            ))}
            {sentences.length === 0 && (
              <p className="text-laqi-muted text-sm text-center mt-4">انتظر أول جملة...</p>
            )}
          </div>

          {/* دور من؟ */}
          <div className={`glass-card p-4 ${isMyTurn ? 'border border-laqi-neon/40' : ''}`}>
            {isMyTurn ? (
              <>
                <p className="text-laqi-neon font-bold text-sm mb-2">دورك! أضف الجملة التالية:</p>
                <textarea
                  value={mySentence}
                  onChange={(e) => setMySentence(e.target.value)}
                  placeholder="اكتب جملتك هنا..."
                  className="input-dark w-full resize-none mb-3"
                  rows={2}
                  maxLength={200}
                />
                <button
                  onClick={submitSentence}
                  disabled={submitting || !mySentence.trim()}
                  className="w-full btn-neon py-3 disabled:opacity-40"
                >
                  {submitting ? '...' : 'أضف الجملة ✍️'}
                </button>
              </>
            ) : (
              <p className="text-laqi-muted text-center animate-pulse py-2">
                دور <span className="text-laqi-neon font-bold">{currentTurnPlayer?.nickname}</span> الآن...
              </p>
            )}
          </div>

          {/* اللاعبون */}
          <div className="flex justify-center gap-3 mt-3 flex-wrap">
            {players.map(p => (
              <span
                key={p.id}
                className={`text-xs px-3 py-1 rounded-full ${
                  p.id === currentTurnId
                    ? 'bg-laqi-neon/20 text-laqi-neon border border-laqi-neon/40'
                    : 'bg-laqi-card text-laqi-muted'
                }`}
              >
                {p.id === currentTurnId ? '✍️ ' : ''}{p.nickname}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ==================== النتيجة — القصة الكاملة ====================
  if (gamePhase === 'result') {
    return (
      <div className="min-h-screen bg-laqi-dark flex flex-col items-center p-4 pt-8">
        <div className="max-w-lg w-full">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">📖</div>
            <h2 className="text-2xl font-black text-laqi-neon">القصة اكتملت!</h2>
          </div>

          <div className="glass-card p-6 mb-6">
            <p className="text-laqi-neon font-bold mb-4 leading-relaxed">{starter}</p>
            {sentences.map((s, i) => (
              <p key={i} className={`mb-3 leading-relaxed text-sm ${s.playerId === playerId ? 'text-laqi-neon' : 'text-laqi-text'}`}>
                {s.text}
                <span className="text-laqi-muted text-xs mr-2">— {s.nickname}</span>
              </p>
            ))}
          </div>

          {isHost && (
            <button
              onClick={() => updateRoomState(roomCode, { phase: 'init' })}
              className="w-full btn-neon py-4 mb-3"
            >
              🔄 قصة جديدة
            </button>
          )}
          {!isHost && <p className="text-laqi-muted text-center mb-3 animate-pulse">في انتظار الهوست...</p>}
          <div className="text-center">
            <Link href="/games" className="text-laqi-muted hover:text-laqi-text text-sm">العودة للألعاب</Link>
          </div>
        </div>
      </div>
    )
  }

  return null
}

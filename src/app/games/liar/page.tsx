'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { GameSetup, GameWaitingRoom } from '@/components/GameLobby'
import { useRoom } from '@/hooks/useRoom'
import { updateRoomState, updateRoomStatus, updatePlayers } from '@/lib/roomService'

// ============================================================
// مواضيع اللعبة
// ============================================================
const TOPICS = [
  { category: 'حيوانات',  word: 'أسد',         decoy: 'نمر'          },
  { category: 'حيوانات',  word: 'فيل',         decoy: 'زرافة'        },
  { category: 'طعام',     word: 'برغر',        decoy: 'بيتزا'        },
  { category: 'طعام',     word: 'سوشي',        decoy: 'ستيك'         },
  { category: 'رياضة',    word: 'كرة القدم',   decoy: 'كرة السلة'    },
  { category: 'أماكن',    word: 'برج خليفة',   decoy: 'أبراج البيت'  },
  { category: 'أماكن',    word: 'باريس',       decoy: 'لندن'         },
  { category: 'تقنية',    word: 'آيفون',       decoy: 'سامسونج'      },
  { category: 'تقنية',    word: 'تيك توك',     decoy: 'انستغرام'     },
  { category: 'أفلام',    word: 'أفاتار',      decoy: 'تيتانيك'      },
  { category: 'موسيقى',   word: 'عود',         decoy: 'ربابة'        },
  { category: 'سيارات',   word: 'لامبورغيني',  decoy: 'فيراري'       },
]

type Phase = 'lobby' | 'waiting' | 'playing'

// ============================================================
// Controller — الشاشة الرئيسية
// ============================================================
export default function LiarPage() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)

  function handleSetupDone(code: string, pid: string) {
    setRoomCode(code)
    setPlayerId(pid)
    setPhase('waiting')
  }

  if (phase === 'lobby') {
    return (
      <GameSetup
        gameType="liar"
        gameName="من الكذاب؟"
        gameEmoji="🎭"
        minPlayers={3}
        onStart={handleSetupDone}
      />
    )
  }

  if (phase === 'waiting' && roomCode && playerId) {
    return (
      <GameWaitingRoom
        roomCode={roomCode}
        playerId={playerId}
        minPlayers={3}
        onGameStart={() => setPhase('playing')}
      />
    )
  }

  if (phase === 'playing' && roomCode && playerId) {
    return <LiarGame roomCode={roomCode} playerId={playerId} />
  }

  return null
}

// ============================================================
// لعبة من الكذاب — Multiplayer
// ============================================================
function LiarGame({ roomCode, playerId }: { roomCode: string; playerId: string }) {
  const { room, isHost } = useRoom(roomCode)
  const [myDescription, setMyDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [myVote, setMyVote] = useState<string | null>(null)
  const [voted, setVoted] = useState(false)

  const gameState = (room?.game_state || {}) as Record<string, unknown>
  const phase = (gameState.phase as string) || 'init'
  const topic = gameState.topic as { category: string; word: string; decoy: string } | undefined
  const liarId = gameState.liarId as string | undefined
  const descriptions = (gameState.descriptions as Record<string, string>) || {}
  const votes = (gameState.votes as Record<string, string>) || {}
  const players = room?.players || []

  const me = players.find(p => p.id === playerId)
  const amLiar = liarId === playerId

  // الهوست: تجهيز اللعبة عند البداية
  useEffect(() => {
    if (!isHost || !room || phase !== 'init') return
    const t = TOPICS[Math.floor(Math.random() * TOPICS.length)]
    const liar = players[Math.floor(Math.random() * players.length)]
    updateRoomState(roomCode, {
      phase: 'describe',
      topic: t,
      liarId: liar.id,
      descriptions: {},
      votes: {},
    })
  }, [isHost, room, phase, roomCode, players])

  // إرسال الوصف
  async function submitDescription() {
    if (!myDescription.trim() || submitted) return
    const newDesc = { ...descriptions, [playerId]: myDescription.trim() }
    setSubmitted(true)
    await updateRoomState(roomCode, { ...gameState, descriptions: newDesc })
    // إذا كل اللاعبين أرسلوا → انتقل للتصويت (الهوست)
    if (isHost && Object.keys(newDesc).length >= players.length) {
      await updateRoomState(roomCode, { ...gameState, descriptions: newDesc, phase: 'vote' })
    }
  }

  // الهوست يتحقق من اكتمال الأوصاف
  useEffect(() => {
    if (!isHost || phase !== 'describe') return
    if (Object.keys(descriptions).length >= players.length && players.length > 0) {
      updateRoomState(roomCode, { ...gameState, phase: 'vote' })
    }
  }, [descriptions, players.length, isHost, phase, roomCode, gameState])

  // إرسال التصويت
  async function submitVote(targetId: string) {
    if (voted) return
    setMyVote(targetId)
    setVoted(true)
    const newVotes = { ...votes, [playerId]: targetId }
    await updateRoomState(roomCode, { ...gameState, votes: newVotes })
    if (isHost && Object.keys(newVotes).length >= players.length - 1) {
      await updateRoomState(roomCode, { ...gameState, votes: newVotes, phase: 'result' })
    }
  }

  // الهوست يتحقق من اكتمال التصويتات
  useEffect(() => {
    if (!isHost || phase !== 'vote') return
    const nonLiar = players.filter(p => p.id !== liarId)
    if (Object.keys(votes).length >= nonLiar.length && nonLiar.length > 0) {
      updateRoomState(roomCode, { ...gameState, phase: 'result' })
    }
  }, [votes, players, liarId, isHost, phase, roomCode, gameState])

  // حساب النتائج
  function countVotes() {
    const count: Record<string, number> = {}
    Object.values(votes).forEach(v => { count[v] = (count[v] || 0) + 1 })
    return count
  }

  // إعادة اللعب
  async function playAgain() {
    const t = TOPICS[Math.floor(Math.random() * TOPICS.length)]
    const liar = players[Math.floor(Math.random() * players.length)]
    setSubmitted(false); setMyDescription(''); setMyVote(null); setVoted(false)
    await updateRoomState(roomCode, {
      phase: 'describe',
      topic: t,
      liarId: liar.id,
      descriptions: {},
      votes: {},
    })
  }

  if (!room || phase === 'init') {
    return (
      <div className="min-h-screen bg-laqi-dark flex items-center justify-center">
        <div className="text-laqi-neon text-xl animate-pulse">جاري تجهيز اللعبة...</div>
      </div>
    )
  }

  // ==================== مرحلة الوصف ====================
  if (phase === 'describe' && topic) {
    return (
      <div className="min-h-screen bg-laqi-dark flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* بطاقة الدور */}
          <div className={`glass-card p-6 text-center mb-6 border-2 ${amLiar ? 'border-red-500/50' : 'border-laqi-neon/30'}`}>
            <div className="text-4xl mb-3">{amLiar ? '😈' : '😇'}</div>
            <p className="text-laqi-muted text-sm mb-2">
              {amLiar ? 'أنت الكذاب!' : `التصنيف: ${topic.category}`}
            </p>
            <div className={`text-3xl font-black ${amLiar ? 'text-red-400' : 'text-laqi-neon'}`}>
              {amLiar ? topic.decoy : topic.word}
            </div>
            {amLiar && (
              <p className="text-red-400/60 text-xs mt-2">اكذب بذكاء ولا يكتشفونك!</p>
            )}
          </div>

          {/* إرسال وصف */}
          <div className="glass-card p-4">
            <label className="text-laqi-muted text-sm mb-2 block">
              اكتب وصفاً قصيراً (جملة أو جملتين)
            </label>
            <textarea
              value={myDescription}
              onChange={(e) => setMyDescription(e.target.value)}
              placeholder="وصفك هنا..."
              className="input-dark w-full resize-none"
              rows={3}
              disabled={submitted}
              maxLength={200}
            />
            <button
              onClick={submitDescription}
              disabled={submitted || !myDescription.trim()}
              className="w-full btn-neon mt-3 py-3 disabled:opacity-40"
            >
              {submitted ? '✅ تم الإرسال' : 'أرسل الوصف'}
            </button>
            {submitted && (
              <p className="text-laqi-muted text-sm text-center mt-2 animate-pulse">
                في انتظار بقية اللاعبين... ({Object.keys(descriptions).length}/{players.length})
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ==================== مرحلة التصويت ====================
  if (phase === 'vote') {
    const otherPlayers = players.filter(p => p.id !== playerId)
    return (
      <div className="min-h-screen bg-laqi-dark flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🕵️</div>
            <h2 className="text-2xl font-black text-laqi-text mb-1">أوصاف الجميع</h2>
            <p className="text-laqi-muted text-sm">من الكذاب فيهم؟</p>
          </div>

          {/* عرض الأوصاف */}
          <div className="space-y-3 mb-6">
            {players.map(p => (
              <div key={p.id} className="glass-card p-3">
                <p className="text-laqi-neon font-bold text-sm mb-1">{p.nickname}:</p>
                <p className="text-laqi-text text-sm">
                  {descriptions[p.id] || <span className="text-laqi-muted italic">لم يكتب شيئاً</span>}
                </p>
              </div>
            ))}
          </div>

          {/* التصويت */}
          {!voted ? (
            <div className="glass-card p-4">
              <p className="text-laqi-text font-bold mb-3 text-center">من تشك فيه؟</p>
              <div className="space-y-2">
                {otherPlayers.map(p => (
                  <button
                    key={p.id}
                    onClick={() => submitVote(p.id)}
                    className="w-full py-3 rounded-xl bg-laqi-card hover:bg-laqi-neon/10 hover:border-laqi-neon/30 border border-transparent text-laqi-text transition-all"
                  >
                    🎯 {p.nickname}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-4 text-center">
              <p className="text-laqi-muted animate-pulse">
                في انتظار بقية الأصوات... ({Object.keys(votes).length}/{players.length - 1})
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ==================== النتيجة ====================
  if (phase === 'result' && topic) {
    const voteCounts = countVotes()
    const mostVoted = Object.entries(voteCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    const caughtLiar = mostVoted === liarId
    const liarPlayer = players.find(p => p.id === liarId)

    return (
      <div className="min-h-screen bg-laqi-dark flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* النتيجة الكبرى */}
          <div className="glass-card p-8 text-center mb-6">
            <div className="text-6xl mb-4">{caughtLiar ? '🎉' : '😈'}</div>
            <h2 className="text-2xl font-black text-laqi-text mb-2">
              {caughtLiar ? 'اشتُكشف الكذاب!' : 'الكذاب فاز!'}
            </h2>
            <p className="text-laqi-neon text-xl font-bold mb-1">{liarPlayer?.nickname}</p>
            <p className="text-laqi-muted text-sm mb-4">كان الكذاب</p>
            <div className="bg-laqi-card rounded-xl p-3 mb-2">
              <p className="text-laqi-muted text-xs mb-1">الكلمة الحقيقية كانت</p>
              <p className="text-laqi-neon font-black text-2xl">{topic.word}</p>
              <p className="text-laqi-muted text-xs mt-1">وكلمة الكذاب: {topic.decoy}</p>
            </div>
          </div>

          {/* عدد الأصوات */}
          <div className="glass-card p-4 mb-6">
            <h3 className="text-laqi-muted text-sm mb-3">نتيجة التصويت</h3>
            {players.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-laqi-card last:border-0">
                <span className="text-laqi-text">
                  {p.nickname}
                  {p.id === liarId && <span className="text-red-400 text-xs mr-2">(الكذاب)</span>}
                </span>
                <span className="text-laqi-neon font-bold">{voteCounts[p.id] || 0} صوت</span>
              </div>
            ))}
          </div>

          {isHost && (
            <button onClick={playAgain} className="w-full btn-neon py-4 text-lg">
              🔄 جولة جديدة
            </button>
          )}
          {!isHost && (
            <p className="text-laqi-muted text-center animate-pulse">في انتظار الهوست لجولة جديدة...</p>
          )}

          <div className="text-center mt-4">
            <Link href="/games" className="text-laqi-muted hover:text-laqi-text text-sm">
              العودة للألعاب
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-laqi-dark flex items-center justify-center">
      <div className="text-laqi-neon animate-pulse">جاري التحميل...</div>
    </div>
  )
}

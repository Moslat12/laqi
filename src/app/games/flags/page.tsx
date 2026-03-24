'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { GameSetup, GameWaitingRoom } from '@/components/GameLobby'
import { useRoom } from '@/hooks/useRoom'
import { updateRoomState, updatePlayers } from '@/lib/roomService'
import { Player } from '@/lib/roomService'

const FLAGS = [
  { flag: '🇸🇦', name: 'السعودية', options: ['الكويت', 'السعودية', 'البحرين', 'قطر'] },
  { flag: '🇯🇵', name: 'اليابان', options: ['كوريا', 'الصين', 'اليابان', 'تايوان'] },
  { flag: '🇧🇷', name: 'البرازيل', options: ['الأرجنتين', 'البيرو', 'البرازيل', 'كولومبيا'] },
  { flag: '🇫🇷', name: 'فرنسا', options: ['إيطاليا', 'ألمانيا', 'فرنسا', 'إسبانيا'] },
  { flag: '🇺🇸', name: 'أمريكا', options: ['كندا', 'أمريكا', 'المكسيك', 'أستراليا'] },
  { flag: '🇦🇺', name: 'أستراليا', options: ['نيوزيلندا', 'أستراليا', 'جنوب أفريقيا', 'كندا'] },
  { flag: '🇩🇪', name: 'ألمانيا', options: ['فرنسا', 'هولندا', 'ألمانيا', 'بلجيكا'] },
  { flag: '🇬🇧', name: 'بريطانيا', options: ['إيرلندا', 'بريطانيا', 'أيسلندا', 'النرويج'] },
  { flag: '🇮🇳', name: 'الهند', options: ['باكستان', 'بنغلاديش', 'الهند', 'سريلانكا'] },
  { flag: '🇨🇳', name: 'الصين', options: ['اليابان', 'الصين', 'كوريا', 'فيتنام'] },
  { flag: '🇦🇪', name: 'الإمارات', options: ['قطر', 'البحرين', 'الإمارات', 'عُمان'] },
  { flag: '🇲🇽', name: 'المكسيك', options: ['الأرجنتين', 'كوبا', 'المكسيك', 'البيرو'] },
  { flag: '🇮🇹', name: 'إيطاليا', options: ['البرتغال', 'اليونان', 'إيطاليا', 'كرواتيا'] },
  { flag: '🇰🇷', name: 'كوريا الجنوبية', options: ['اليابان', 'كوريا الجنوبية', 'الصين', 'تايلاند'] },
  { flag: '🇹🇷', name: 'تركيا', options: ['إيران', 'العراق', 'تركيا', 'أذربيجان'] },
  { flag: '🇪🇬', name: 'مصر', options: ['الجزائر', 'المغرب', 'مصر', 'ليبيا'] },
  { flag: '🇳🇱', name: 'هولندا', options: ['بلجيكا', 'الدنمارك', 'هولندا', 'السويد'] },
  { flag: '🇨🇦', name: 'كندا', options: ['أستراليا', 'أمريكا', 'نيوزيلندا', 'كندا'] },
  { flag: '🇷🇺', name: 'روسيا', options: ['أوكرانيا', 'روسيا', 'بولندا', 'فنلندا'] },
  { flag: '🇿🇦', name: 'جنوب أفريقيا', options: ['نيجيريا', 'كينيا', 'جنوب أفريقيا', 'إثيوبيا'] },
]

const ROUND_TIME = 10
const ROUNDS = 8

type Phase = 'lobby' | 'waiting' | 'playing'

export default function FlagsPage() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)

  function handleSetupDone(code: string, pid: string) {
    setRoomCode(code); setPlayerId(pid); setPhase('waiting')
  }

  if (phase === 'lobby') return (
    <GameSetup gameType="flags" gameName="أعلام العالم" gameEmoji="🏳️" minPlayers={2} onStart={handleSetupDone} />
  )
  if (phase === 'waiting' && roomCode && playerId) return (
    <GameWaitingRoom roomCode={roomCode} playerId={playerId} minPlayers={2} onGameStart={() => setPhase('playing')} />
  )
  if (phase === 'playing' && roomCode && playerId) return (
    <FlagsGame roomCode={roomCode} playerId={playerId} />
  )
  return null
}

function FlagsGame({ roomCode, playerId }: { roomCode: string; playerId: string }) {
  const { room, isHost } = useRoom(roomCode)
  const [myAnswer, setMyAnswer] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME)

  const gs = (room?.game_state || {}) as Record<string, unknown>
  const gamePhase = (gs.phase as string) || 'init'
  const roundIdx = (gs.roundIdx as number) || 0
  const answers = (gs.answers as Record<string, string>) || {}
  const flagOrder = (gs.flagOrder as number[]) || []
  const players = room?.players || []

  const currentFlagIdx = flagOrder[roundIdx] ?? 0
  const currentFlag = FLAGS[currentFlagIdx]

  // تجهيز اللعبة
  useEffect(() => {
    if (!isHost || !room || gamePhase !== 'init') return
    const shuffled = Array.from({ length: FLAGS.length }, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, ROUNDS)
    updateRoomState(roomCode, {
      phase: 'round',
      roundIdx: 0,
      flagOrder: shuffled,
      answers: {},
      scores: Object.fromEntries(players.map(p => [p.id, 0])),
    })
  }, [isHost, room, gamePhase, roomCode, players])

  const moveNext = useCallback(async () => {
    if (!isHost) return
    const scores = (gs.scores as Record<string, number>) || {}
    const newScores = { ...scores }
    // من أجاب صح أولاً يأخذ نقاط أكثر بناءً على الوقت المتبقي
    Object.entries(answers).forEach(([pid, ans]) => {
      if (ans === currentFlag?.name) {
        newScores[pid] = (newScores[pid] || 0) + (timeLeft > 5 ? 15 : 10)
      }
    })
    const updatedPlayers: Player[] = players.map(p => ({ ...p, score: newScores[p.id] || 0 }))
    await updatePlayers(roomCode, updatedPlayers)

    const nextIdx = roundIdx + 1
    if (nextIdx >= ROUNDS) {
      await updateRoomState(roomCode, { ...gs, phase: 'result', scores: newScores })
    } else {
      await updateRoomState(roomCode, { ...gs, phase: 'round', roundIdx: nextIdx, answers: {}, scores: newScores })
    }
  }, [isHost, gs, answers, currentFlag, roundIdx, players, roomCode, timeLeft])

  useEffect(() => {
    if (gamePhase !== 'round') return
    setMyAnswer(null); setAnswered(false); setTimeLeft(ROUND_TIME)
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); if (isHost) moveNext(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [gamePhase, roundIdx, isHost, moveNext])

  useEffect(() => {
    if (!isHost || gamePhase !== 'round') return
    if (Object.keys(answers).length >= players.length && players.length > 0) {
      setTimeout(() => moveNext(), 1000)
    }
  }, [answers, players.length, isHost, gamePhase, moveNext])

  async function handleAnswer(answer: string) {
    if (answered) return
    setMyAnswer(answer); setAnswered(true)
    const newAnswers = { ...answers, [playerId]: answer }
    await updateRoomState(roomCode, { ...gs, answers: newAnswers })
  }

  if (!room || gamePhase === 'init') return (
    <div className="min-h-screen bg-laqi-dark flex items-center justify-center">
      <div className="text-laqi-neon text-xl animate-pulse">جاري تجهيز الأعلام...</div>
    </div>
  )

  if (gamePhase === 'round' && currentFlag) {
    return (
      <div className="min-h-screen bg-laqi-dark flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="flex justify-between text-laqi-muted text-sm mb-4">
            <span>جولة {roundIdx + 1} / {ROUNDS}</span>
            <span className={`font-black text-xl ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-laqi-neon'}`}>
              {timeLeft}
            </span>
          </div>
          <div className="h-2 bg-laqi-card rounded-full mb-8 overflow-hidden">
            <div className="h-full bg-laqi-neon transition-all duration-1000" style={{ width: `${(timeLeft / ROUND_TIME) * 100}%` }} />
          </div>

          <div className="text-center mb-8">
            <div className="text-9xl mb-2">{currentFlag.flag}</div>
            <p className="text-laqi-muted text-sm">هذا علم أي دولة؟</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {currentFlag.options.map((opt) => {
              let style = 'bg-laqi-card hover:bg-laqi-neon/10 border border-transparent hover:border-laqi-neon/40'
              if (answered) {
                if (opt === currentFlag.name) style = 'bg-green-500/20 border border-green-500/50'
                else if (opt === myAnswer) style = 'bg-red-500/20 border border-red-500/50'
                else style = 'bg-laqi-card opacity-40 border border-transparent'
              }
              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={answered}
                  className={`p-4 rounded-xl text-laqi-text font-medium transition-all ${style}`}
                >
                  {opt}
                </button>
              )
            })}
          </div>

          {answered && (
            <p className="text-center text-sm mt-4 text-laqi-muted animate-pulse">
              {myAnswer === currentFlag.name ? '✅ صح!' : `❌ الجواب: ${currentFlag.name}`}
              {' — '}({Object.keys(answers).length}/{players.length})
            </p>
          )}

          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            {[...players].sort((a, b) => (b.score || 0) - (a.score || 0)).map(p => (
              <span key={p.id} className={`text-xs ${p.id === playerId ? 'text-laqi-neon font-bold' : 'text-laqi-muted'}`}>
                {p.nickname}: {p.score || 0}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (gamePhase === 'result') {
    const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0))
    return (
      <div className="min-h-screen bg-laqi-dark flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🏆</div>
            <h2 className="text-2xl font-black text-laqi-neon">{sorted[0]?.nickname} فاز!</h2>
          </div>
          <div className="glass-card p-4 mb-6">
            {sorted.map((p, i) => (
              <div key={p.id} className={`flex items-center gap-3 py-3 border-b border-laqi-card last:border-0 ${p.id === playerId ? 'text-laqi-neon' : 'text-laqi-text'}`}>
                <span className="text-2xl">{['🥇','🥈','🥉'][i] || `${i+1}.`}</span>
                <span className="flex-1 font-medium">{p.nickname}</span>
                <span className="font-black">{p.score || 0}</span>
              </div>
            ))}
          </div>
          {isHost && (
            <button onClick={() => updateRoomState(roomCode, { phase: 'init' })} className="w-full btn-neon py-4 mb-3">
              🔄 جولة جديدة
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

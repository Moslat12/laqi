'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { GameSetup, GameWaitingRoom } from '@/components/GameLobby'
import { useRoom } from '@/hooks/useRoom'
import { updateRoomState, updatePlayers } from '@/lib/roomService'
import { Player } from '@/lib/roomService'

const QUESTIONS = [
  { q: 'ما عاصمة المملكة العربية السعودية؟', options: ['جدة', 'الرياض', 'مكة', 'الدمام'], answer: 1, category: 'جغرافيا' },
  { q: 'كم عدد لاعبي كرة القدم لكل فريق؟', options: ['9', '10', '11', '12'], answer: 2, category: 'رياضة' },
  { q: 'ما أكبر محيط في العالم؟', options: ['الهندي', 'الأطلسي', 'المتجمد', 'الهادئ'], answer: 3, category: 'جغرافيا' },
  { q: 'من أول إنسان وطئ القمر؟', options: ['يوري غاغارين', 'نيل أرمسترونغ', 'باز ألدرين', 'جون غلين'], answer: 1, category: 'علوم' },
  { q: 'أي دولة اخترعت الورق؟', options: ['اليابان', 'مصر', 'الصين', 'الهند'], answer: 2, category: 'تاريخ' },
  { q: 'ما أصغر دولة مساحةً؟', options: ['موناكو', 'سان مارينو', 'الفاتيكان', 'ليختنشتاين'], answer: 2, category: 'جغرافيا' },
  { q: 'كم لون في قوس قزح؟', options: ['5', '6', '7', '8'], answer: 2, category: 'علوم' },
  { q: 'ما أكبر كوكب في المجموعة الشمسية؟', options: ['زحل', 'نبتون', 'المشتري', 'أورانوس'], answer: 2, category: 'علوم' },
  { q: 'في أي عام تأسست آبل؟', options: ['1972', '1976', '1980', '1984'], answer: 1, category: 'تقنية' },
  { q: 'ما عاصمة اليابان؟', options: ['أوساكا', 'كيوتو', 'طوكيو', 'هيروشيما'], answer: 2, category: 'جغرافيا' },
  { q: 'كم قارة في العالم؟', options: ['5', '6', '7', '8'], answer: 2, category: 'جغرافيا' },
  { q: 'الرمز الكيميائي Au لأي عنصر؟', options: ['فضة', 'ذهب', 'نحاس', 'حديد'], answer: 1, category: 'علوم' },
  { q: 'ما عاصمة فرنسا؟', options: ['مرسيليا', 'ليون', 'باريس', 'نيس'], answer: 2, category: 'جغرافيا' },
  { q: 'كم ثانية في الساعة؟', options: ['3000', '3200', '3600', '4000'], answer: 2, category: 'رياضيات' },
  { q: 'ما أطول نهر في العالم؟', options: ['الأمازون', 'المسيسيبي', 'النيل', 'اليانغتسي'], answer: 2, category: 'جغرافيا' },
]

const QUESTION_TIME = 15
const QUESTIONS_PER_ROUND = 8

type Phase = 'lobby' | 'waiting' | 'playing'

export default function TriviaPage() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)

  function handleSetupDone(code: string, pid: string) {
    setRoomCode(code); setPlayerId(pid); setPhase('waiting')
  }

  if (phase === 'lobby') return (
    <GameSetup gameType="trivia" gameName="أسئلة عامة" gameEmoji="🧠" minPlayers={2} onStart={handleSetupDone} />
  )
  if (phase === 'waiting' && roomCode && playerId) return (
    <GameWaitingRoom roomCode={roomCode} playerId={playerId} minPlayers={2} onGameStart={() => setPhase('playing')} />
  )
  if (phase === 'playing' && roomCode && playerId) return (
    <TriviaGame roomCode={roomCode} playerId={playerId} />
  )
  return null
}

function TriviaGame({ roomCode, playerId }: { roomCode: string; playerId: string }) {
  const { room, isHost } = useRoom(roomCode)
  const [myAnswer, setMyAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)

  const gs = (room?.game_state || {}) as Record<string, unknown>
  const gamePhase = (gs.phase as string) || 'init'
  const questionIdx = (gs.questionIdx as number) || 0
  const answers = (gs.answers as Record<string, number>) || {}
  const questionOrder = (gs.questionOrder as number[]) || []
  const players = room?.players || []

  const currentQIdx = questionOrder[questionIdx] ?? 0
  const currentQ = QUESTIONS[currentQIdx]

  // الهوست: تجهيز ترتيب الأسئلة عشوائياً
  useEffect(() => {
    if (!isHost || !room || gamePhase !== 'init') return
    const shuffled = Array.from({ length: QUESTIONS.length }, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_ROUND)
    updateRoomState(roomCode, {
      phase: 'question',
      questionIdx: 0,
      questionOrder: shuffled,
      answers: {},
      scores: Object.fromEntries(players.map(p => [p.id, 0])),
    })
  }, [isHost, room, gamePhase, roomCode, players])

  // مؤقت السؤال
  const moveNext = useCallback(async () => {
    if (!isHost) return
    const scores = (gs.scores as Record<string, number>) || {}
    // احسب النقاط
    const newScores = { ...scores }
    Object.entries(answers).forEach(([pid, ans]) => {
      if (ans === currentQ?.answer) {
        newScores[pid] = (newScores[pid] || 0) + 10
      }
    })
    // تحديث نقاط اللاعبين في players array
    const updatedPlayers: Player[] = players.map(p => ({
      ...p,
      score: newScores[p.id] || 0,
    }))
    await updatePlayers(roomCode, updatedPlayers)

    const nextIdx = questionIdx + 1
    if (nextIdx >= QUESTIONS_PER_ROUND) {
      await updateRoomState(roomCode, { ...gs, phase: 'result', scores: newScores })
    } else {
      await updateRoomState(roomCode, {
        ...gs, phase: 'question', questionIdx: nextIdx, answers: {}, scores: newScores,
      })
    }
  }, [isHost, gs, answers, currentQ, questionIdx, players, roomCode])

  useEffect(() => {
    if (gamePhase !== 'question') return
    setMyAnswer(null); setAnswered(false); setTimeLeft(QUESTION_TIME)
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); if (isHost) moveNext(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [gamePhase, questionIdx, isHost, moveNext])

  // الهوست: الانتقال عند إجابة الجميع
  useEffect(() => {
    if (!isHost || gamePhase !== 'question') return
    if (Object.keys(answers).length >= players.length && players.length > 0) {
      setTimeout(() => moveNext(), 1500)
    }
  }, [answers, players.length, isHost, gamePhase, moveNext])

  async function handleAnswer(idx: number) {
    if (answered) return
    setMyAnswer(idx); setAnswered(true)
    const newAnswers = { ...answers, [playerId]: idx }
    await updateRoomState(roomCode, { ...gs, answers: newAnswers })
  }

  if (!room || gamePhase === 'init') return (
    <div className="min-h-screen bg-laqi-dark flex items-center justify-center">
      <div className="text-laqi-neon text-xl animate-pulse">جاري تجهيز الأسئلة...</div>
    </div>
  )

  // ==================== السؤال ====================
  if (gamePhase === 'question' && currentQ) {
    const progress = ((QUESTION_TIME - timeLeft) / QUESTION_TIME) * 100
    return (
      <div className="min-h-screen bg-laqi-dark flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* شريط التقدم */}
          <div className="flex items-center justify-between mb-4 text-laqi-muted text-sm">
            <span>سؤال {questionIdx + 1} / {QUESTIONS_PER_ROUND}</span>
            <span className={`font-black text-xl ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-laqi-neon'}`}>
              {timeLeft}
            </span>
          </div>
          <div className="h-2 bg-laqi-card rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-laqi-neon transition-all duration-1000"
              style={{ width: `${100 - progress}%` }}
            />
          </div>

          {/* السؤال */}
          <div className="glass-card p-6 mb-6 text-center">
            <span className="text-xs text-laqi-muted bg-laqi-card px-3 py-1 rounded-full mb-3 inline-block">
              {currentQ.category}
            </span>
            <p className="text-xl font-bold text-laqi-text">{currentQ.q}</p>
          </div>

          {/* الخيارات */}
          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((opt, i) => {
              let style = 'bg-laqi-card hover:bg-laqi-neon/10 hover:border-laqi-neon/40 border border-transparent'
              if (answered) {
                if (i === currentQ.answer) style = 'bg-green-500/20 border border-green-500/50'
                else if (i === myAnswer) style = 'bg-red-500/20 border border-red-500/50'
                else style = 'bg-laqi-card opacity-50 border border-transparent'
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                  className={`p-4 rounded-xl text-right text-laqi-text font-medium transition-all ${style}`}
                >
                  {opt}
                </button>
              )
            })}
          </div>

          {answered && (
            <p className="text-center text-laqi-muted mt-4 animate-pulse text-sm">
              {myAnswer === currentQ.answer ? '✅ إجابة صحيحة! +10 نقاط' : '❌ إجابة خاطئة'}
              {' — '}في انتظار بقية اللاعبين ({Object.keys(answers).length}/{players.length})
            </p>
          )}

          {/* النقاط الحالية */}
          <div className="mt-4 flex justify-center gap-4 flex-wrap">
            {[...players].sort((a, b) => (b.score || 0) - (a.score || 0)).map(p => (
              <span key={p.id} className={`text-sm ${p.id === playerId ? 'text-laqi-neon font-bold' : 'text-laqi-muted'}`}>
                {p.nickname}: {p.score || 0}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ==================== النتيجة النهائية ====================
  if (gamePhase === 'result') {
    const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0))
    const winner = sorted[0]
    const me = players.find(p => p.id === playerId)
    const myRank = sorted.findIndex(p => p.id === playerId) + 1

    return (
      <div className="min-h-screen bg-laqi-dark flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🏆</div>
            <h2 className="text-2xl font-black text-laqi-neon">{winner?.nickname} فاز!</h2>
            <p className="text-laqi-muted">بـ {winner?.score} نقطة</p>
          </div>

          <div className="glass-card p-4 mb-6">
            {sorted.map((p, i) => (
              <div key={p.id} className={`flex items-center gap-3 py-3 border-b border-laqi-card last:border-0 ${p.id === playerId ? 'text-laqi-neon' : 'text-laqi-text'}`}>
                <span className="text-2xl">{['🥇', '🥈', '🥉'][i] || `${i + 1}.`}</span>
                <span className="flex-1 font-medium">{p.nickname}</span>
                <span className="font-black">{p.score || 0}</span>
              </div>
            ))}
          </div>

          <div className="glass-card p-4 text-center mb-4">
            <p className="text-laqi-muted text-sm">ترتيبك</p>
            <p className="text-3xl font-black text-laqi-neon">{myRank} / {players.length}</p>
            <p className="text-laqi-muted text-sm">نقاطك: {me?.score || 0}</p>
          </div>

          {isHost && (
            <button
              onClick={() => updateRoomState(roomCode, { phase: 'init' })}
              className="w-full btn-neon py-4"
            >
              🔄 جولة جديدة
            </button>
          )}
          {!isHost && <p className="text-laqi-muted text-center animate-pulse">في انتظار الهوست...</p>}
          <div className="text-center mt-4">
            <Link href="/games" className="text-laqi-muted hover:text-laqi-text text-sm">العودة للألعاب</Link>
          </div>
        </div>
      </div>
    )
  }

  return <div className="min-h-screen bg-laqi-dark flex items-center justify-center"><div className="text-laqi-neon animate-pulse">جاري التحميل...</div></div>
}

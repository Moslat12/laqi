'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { GameSetup, GameWaitingRoom } from '@/components/GameLobby'
import { useRoom } from '@/hooks/useRoom'
import { updateRoomState, updatePlayers } from '@/lib/roomService'
import { Player } from '@/lib/roomService'

const WORDS = [
  'كتاب', 'بيت', 'شمس', 'قمر', 'نجمة', 'بحر', 'جبل', 'صحراء',
  'مدرسة', 'سيارة', 'طائرة', 'قطار', 'مطبخ', 'غرفة', 'نافذة',
  'قلم', 'ورقة', 'حقيبة', 'ساعة', 'هاتف', 'تلفاز', 'كرسي',
  'طاولة', 'سرير', 'باب', 'شجرة', 'زهرة', 'نهر', 'سماء', 'أرض',
]

const MAX_ATTEMPTS = 6

type LetterState = 'correct' | 'present' | 'absent' | 'empty'
type Phase = 'lobby' | 'waiting' | 'playing'

export default function WordlePage() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)

  function handleSetupDone(code: string, pid: string) {
    setRoomCode(code); setPlayerId(pid); setPhase('waiting')
  }

  if (phase === 'lobby') return (
    <GameSetup gameType="wordle" gameName="تخمين الكلمة" gameEmoji="🔤" minPlayers={2} onStart={handleSetupDone} />
  )
  if (phase === 'waiting' && roomCode && playerId) return (
    <GameWaitingRoom roomCode={roomCode} playerId={playerId} minPlayers={2} onGameStart={() => setPhase('playing')} />
  )
  if (phase === 'playing' && roomCode && playerId) return (
    <WordleGame roomCode={roomCode} playerId={playerId} />
  )
  return null
}

function getLetterStates(guess: string, target: string): LetterState[] {
  const result: LetterState[] = Array(target.length).fill('absent')
  const targetArr = target.split('')
  const used = Array(target.length).fill(false)
  // الصحيح أولاً
  guess.split('').forEach((l, i) => {
    if (l === targetArr[i]) { result[i] = 'correct'; used[i] = true }
  })
  // الموجود
  guess.split('').forEach((l, i) => {
    if (result[i] === 'correct') return
    const ti = targetArr.findIndex((t, j) => t === l && !used[j])
    if (ti !== -1) { result[i] = 'present'; used[ti] = true }
  })
  return result
}

function WordleGame({ roomCode, playerId }: { roomCode: string; playerId: string }) {
  const { room, isHost } = useRoom(roomCode)
  const [currentGuess, setCurrentGuess] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [states, setStates] = useState<LetterState[][]>([])
  const [finished, setFinished] = useState(false)
  const [won, setWon] = useState(false)

  const gs = (room?.game_state || {}) as Record<string, unknown>
  const gamePhase = (gs.phase as string) || 'init'
  const targetWord = gs.targetWord as string
  const results = (gs.results as Record<string, { attempts: number; won: boolean }>) || {}
  const players = room?.players || []
  const me = players.find(p => p.id === playerId)

  // تجهيز الكلمة (الهوست)
  useEffect(() => {
    if (!isHost || !room || gamePhase !== 'init') return
    const word = WORDS[Math.floor(Math.random() * WORDS.length)]
    setGuesses([]); setStates([]); setCurrentGuess(''); setFinished(false); setWon(false)
    updateRoomState(roomCode, { phase: 'playing', targetWord: word, results: {} })
  }, [isHost, room, gamePhase, roomCode])

  // إعادة ضبط اللعبة لكل لاعب
  useEffect(() => {
    if (gamePhase === 'playing') {
      setGuesses([]); setStates([]); setCurrentGuess(''); setFinished(false); setWon(false)
    }
  }, [gamePhase, gs.targetWord])

  const submitGuess = useCallback(async () => {
    if (!targetWord || finished) return
    const word = currentGuess.trim()
    if (word.length === 0) return

    const letterStates = getLetterStates(word, targetWord)
    const newGuesses = [...guesses, word]
    const newStates = [...states, letterStates]
    setGuesses(newGuesses); setStates(newStates); setCurrentGuess('')

    const isWon = word === targetWord
    const isDone = isWon || newGuesses.length >= MAX_ATTEMPTS

    if (isDone) {
      setFinished(true); setWon(isWon)
      const newResults = { ...results, [playerId]: { attempts: newGuesses.length, won: isWon } }
      await updateRoomState(roomCode, { ...gs, results: newResults })
      // تحديث النقاط
      const updatedPlayers: Player[] = players.map(p => ({
        ...p,
        score: p.id === playerId
          ? (p.score || 0) + (isWon ? Math.max(10, 60 - newGuesses.length * 10) : 0)
          : p.score || 0,
      }))
      await updatePlayers(roomCode, updatedPlayers)
      // إذا انتهى الجميع
      if (isHost && Object.keys(newResults).length >= players.length) {
        await updateRoomState(roomCode, { ...gs, results: newResults, phase: 'result' })
      }
    }
  }, [targetWord, finished, currentGuess, guesses, states, results, playerId, roomCode, gs, players, isHost])

  // الهوست: تحقق من انتهاء الجميع
  useEffect(() => {
    if (!isHost || gamePhase !== 'playing') return
    if (Object.keys(results).length >= players.length && players.length > 0) {
      updateRoomState(roomCode, { ...gs, phase: 'result' })
    }
  }, [results, players.length, isHost, gamePhase, roomCode, gs])

  const colorMap: Record<LetterState, string> = {
    correct: 'bg-green-500 text-white border-green-500',
    present: 'bg-yellow-500 text-white border-yellow-500',
    absent: 'bg-laqi-card text-laqi-muted border-laqi-card',
    empty: 'bg-transparent border-laqi-muted/30',
  }

  if (!room || gamePhase === 'init') return (
    <div className="min-h-screen bg-laqi-dark flex items-center justify-center">
      <div className="text-laqi-neon text-xl animate-pulse">جاري اختيار الكلمة...</div>
    </div>
  )

  if (gamePhase === 'playing' && targetWord) {
    const wordLen = targetWord.length
    return (
      <div className="min-h-screen bg-laqi-dark flex flex-col items-center pt-8 p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-laqi-neon mb-1">تخمين الكلمة</h2>
            <p className="text-laqi-muted text-sm">كلمة من {wordLen} أحرف — {MAX_ATTEMPTS} محاولات</p>
            <div className="flex justify-center gap-2 mt-2 flex-wrap">
              {players.map(p => (
                <span key={p.id} className={`text-xs px-2 py-0.5 rounded-full ${
                  results[p.id] ? (results[p.id].won ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')
                  : p.id === playerId ? 'bg-laqi-neon/20 text-laqi-neon' : 'bg-laqi-card text-laqi-muted'
                }`}>
                  {p.nickname} {results[p.id] ? (results[p.id].won ? '✅' : '❌') : '...'}
                </span>
              ))}
            </div>
          </div>

          {/* الشبكة */}
          <div className="space-y-2 mb-6 flex flex-col items-center">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, rowI) => {
              const guess = guesses[rowI] || ''
              const rowStates = states[rowI] || []
              return (
                <div key={rowI} className="flex gap-2" dir="ltr">
                  {Array.from({ length: wordLen }).map((_, colI) => {
                    const letter = guess[colI] || (rowI === guesses.length ? currentGuess[colI] : '')
                    const state: LetterState = rowStates[colI] || 'empty'
                    return (
                      <div
                        key={colI}
                        className={`w-11 h-11 flex items-center justify-center text-lg font-black rounded-lg border-2 transition-all ${colorMap[state]}`}
                      >
                        {letter}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* الإدخال */}
          {!finished ? (
            <div className="glass-card p-4">
              <input
                type="text"
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitGuess()}
                placeholder={`كلمة من ${wordLen} أحرف...`}
                className="input-dark w-full text-center text-xl mb-3"
                maxLength={wordLen}
                dir="rtl"
              />
              <button onClick={submitGuess} disabled={!currentGuess.trim()} className="w-full btn-neon py-3 disabled:opacity-40">
                تأكيد
              </button>
            </div>
          ) : (
            <div className={`glass-card p-4 text-center border ${won ? 'border-green-500/40' : 'border-red-500/40'}`}>
              <p className={`text-xl font-black mb-1 ${won ? 'text-green-400' : 'text-red-400'}`}>
                {won ? '🎉 صح!' : '😔 غلط'}
              </p>
              {!won && <p className="text-laqi-muted text-sm">الكلمة كانت: <span className="text-laqi-neon font-bold">{targetWord}</span></p>}
              <p className="text-laqi-muted text-xs mt-2 animate-pulse">في انتظار بقية اللاعبين...</p>
            </div>
          )}
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
            <div className="text-5xl mb-2">🏆</div>
            <h2 className="text-2xl font-black text-laqi-neon mb-1">انتهت الجولة!</h2>
            <p className="text-laqi-muted text-sm">الكلمة كانت: <span className="text-laqi-neon font-bold">{targetWord}</span></p>
          </div>
          <div className="glass-card p-4 mb-6">
            {sorted.map((p, i) => {
              const r = results[p.id]
              return (
                <div key={p.id} className={`flex items-center gap-3 py-3 border-b border-laqi-card last:border-0 ${p.id === playerId ? 'text-laqi-neon' : 'text-laqi-text'}`}>
                  <span className="text-2xl">{['🥇','🥈','🥉'][i] || `${i+1}.`}</span>
                  <span className="flex-1 font-medium">{p.nickname}</span>
                  <span className="text-sm text-laqi-muted">{r ? (r.won ? `✅ ${r.attempts} محاولة` : '❌') : '⏳'}</span>
                  <span className="font-black">{p.score || 0}</span>
                </div>
              )
            })}
          </div>
          {isHost && (
            <button onClick={() => updateRoomState(roomCode, { phase: 'init' })} className="w-full btn-neon py-4 mb-3">
              🔄 كلمة جديدة
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

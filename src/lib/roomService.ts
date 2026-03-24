import { supabase } from './supabase'

export interface Player {
  id: string
  nickname: string
  isHost: boolean
  score: number
  ready: boolean
  answer?: string | number | null
}

export interface Room {
  id: string
  code: string
  game_type: string
  host_nickname: string
  status: 'waiting' | 'playing' | 'finished'
  game_state: Record<string, unknown>
  players: Player[]
  created_at: string
  updated_at: string
}

// توليد كود عشوائي 6 أحرف
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}

// إنشاء غرفة جديدة
export async function createRoom(gameType: string, hostNickname: string): Promise<{ room: Room; playerId: string }> {
  const code = generateCode()
  const playerId = crypto.randomUUID()

  const host: Player = {
    id: playerId,
    nickname: hostNickname,
    isHost: true,
    score: 0,
    ready: true,
  }

  const { data, error } = await supabase
    .from('rooms')
    .insert({
      code,
      game_type: gameType,
      host_nickname: hostNickname,
      status: 'waiting',
      game_state: {},
      players: [host],
    })
    .select()
    .single()

  if (error) throw new Error('فشل إنشاء الغرفة: ' + error.message)

  if (typeof window !== 'undefined') {
    localStorage.setItem(`laqi_player_${code}`, playerId)
  }

  return { room: data as Room, playerId }
}

// الانضمام لغرفة
export async function joinRoom(code: string, nickname: string): Promise<{ room: Room; playerId: string }> {
  const upperCode = code.toUpperCase().trim()

  const { data: existing, error: fetchError } = await supabase
    .from('rooms')
    .select()
    .eq('code', upperCode)
    .single()

  if (fetchError || !existing) throw new Error('الغرفة غير موجودة، تحقق من الكود')
  if (existing.status === 'playing') throw new Error('اللعبة بدأت، لا يمكن الانضمام')
  if (existing.status === 'finished') throw new Error('اللعبة انتهت')

  const players: Player[] = existing.players || []
  if (players.length >= 10) throw new Error('الغرفة ممتلئة (الحد الأقصى 10 لاعبين)')

  // منع نفس الاسم
  const sameName = players.find(p => p.nickname === nickname.trim())
  if (sameName) throw new Error('الاسم مأخوذ، اختر اسماً آخر')

  const playerId = crypto.randomUUID()
  const newPlayer: Player = {
    id: playerId,
    nickname: nickname.trim(),
    isHost: false,
    score: 0,
    ready: false,
  }

  const updatedPlayers = [...players, newPlayer]

  const { data, error } = await supabase
    .from('rooms')
    .update({ players: updatedPlayers, updated_at: new Date().toISOString() })
    .eq('code', upperCode)
    .select()
    .single()

  if (error) throw new Error('فشل الانضمام: ' + error.message)

  if (typeof window !== 'undefined') {
    localStorage.setItem(`laqi_player_${upperCode}`, playerId)
  }

  return { room: data as Room, playerId }
}

// تحديث الغرفة (حالة اللعبة)
export async function updateRoomState(code: string, gameState: Record<string, unknown>) {
  const { error } = await supabase
    .from('rooms')
    .update({ game_state: gameState, updated_at: new Date().toISOString() })
    .eq('code', code)
  if (error) throw new Error(error.message)
}

// تحديث اللاعبين
export async function updatePlayers(code: string, players: Player[]) {
  const { error } = await supabase
    .from('rooms')
    .update({ players, updated_at: new Date().toISOString() })
    .eq('code', code)
  if (error) throw new Error(error.message)
}

// تغيير status الغرفة
export async function updateRoomStatus(code: string, status: Room['status'], gameState?: Record<string, unknown>) {
  const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (gameState !== undefined) update.game_state = gameState
  const { error } = await supabase
    .from('rooms')
    .update(update)
    .eq('code', code)
  if (error) throw new Error(error.message)
}

// الحصول على playerId المحفوظ
export function getSavedPlayerId(code: string): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(`laqi_player_${code.toUpperCase()}`)
}

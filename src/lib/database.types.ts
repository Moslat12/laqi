export type Database = {
  public: {
    Tables: {
      // جدول المستخدمين
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          level: number
          xp: number
          coins: number // الفيش
          is_pro: boolean
          games_played: number
          games_won: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          level?: number
          xp?: number
          coins?: number
          is_pro?: boolean
          games_played?: number
          games_won?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          level?: number
          xp?: number
          coins?: number
          is_pro?: boolean
          games_played?: number
          games_won?: number
          updated_at?: string
        }
      }

      // جدول الغرف
      rooms: {
        Row: {
          id: string
          code: string
          game_type: string
          host_nickname: string
          status: string
          game_state: Record<string, unknown>
          players: Record<string, unknown>[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          game_type: string
          host_nickname: string
          status?: string
          game_state?: Record<string, unknown>
          players?: Record<string, unknown>[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: string
          game_state?: Record<string, unknown>
          players?: Record<string, unknown>[]
          updated_at?: string
        }
      }

      // جدول اللاعبين في الغرفة
      room_players: {
        Row: {
          id: string
          room_id: string
          player_id: string
          score: number
          is_ready: boolean
          role: string | null // مثلاً "الكذاب" في لعبة من الكذاب
          joined_at: string
        }
        Insert: {
          id?: string
          room_id: string
          player_id: string
          score?: number
          is_ready?: boolean
          role?: string | null
          joined_at?: string
        }
        Update: {
          score?: number
          is_ready?: boolean
          role?: string | null
        }
      }

      // جدول سجل الألعاب
      game_history: {
        Row: {
          id: string
          room_id: string
          player_id: string
          game_type: string
          score: number
          is_winner: boolean
          xp_earned: number
          played_at: string
        }
        Insert: {
          id?: string
          room_id: string
          player_id: string
          game_type: string
          score: number
          is_winner?: boolean
          xp_earned?: number
          played_at?: string
        }
        Update: {}
      }

      // جدول كلمات Wordle
      wordle_words: {
        Row: {
          id: string
          word: string
          date: string // اليوم المخصص للكلمة
          difficulty: 'easy' | 'medium' | 'hard'
          hint: string | null
        }
        Insert: {
          id?: string
          word: string
          date: string
          difficulty?: 'easy' | 'medium' | 'hard'
          hint?: string | null
        }
        Update: {
          word?: string
          date?: string
          difficulty?: 'easy' | 'medium' | 'hard'
          hint?: string | null
        }
      }

      // جدول المعاملات المالية (الفيش)
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'purchase' | 'spend' | 'reward' | 'subscription'
          amount: number
          coins_amount: number
          status: 'pending' | 'completed' | 'failed'
          moyasar_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'purchase' | 'spend' | 'reward' | 'subscription'
          amount: number
          coins_amount: number
          status?: 'pending' | 'completed' | 'failed'
          moyasar_id?: string | null
          created_at?: string
        }
        Update: {
          status?: 'pending' | 'completed' | 'failed'
          moyasar_id?: string | null
        }
      }
    }
  }
}

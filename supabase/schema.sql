-- ============================================
-- لاقي - قاعدة البيانات
-- ============================================

-- تفعيل UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. جدول المستخدمين (Profiles)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0, -- الفيش
  is_pro BOOLEAN DEFAULT FALSE,
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "يقدر أي شخص يشوف البروفايلات" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "المستخدم يقدر يعدل بروفايله" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "المستخدم يقدر ينشئ بروفايله" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. جدول الغرف (Rooms)
-- ============================================
CREATE TABLE public.rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- كود 6 أحرف
  host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  game_type TEXT NOT NULL CHECK (game_type IN ('wordle', 'liar', 'story', 'flags', 'trivia')),
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  max_players INTEGER DEFAULT 8,
  current_round INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "أي شخص يقدر يشوف الغرف" ON public.rooms
  FOR SELECT USING (true);

CREATE POLICY "أي مستخدم مسجل يقدر ينشئ غرفة" ON public.rooms
  FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "الهوست يقدر يعدل غرفته" ON public.rooms
  FOR UPDATE USING (auth.uid() = host_id);

-- ============================================
-- 3. جدول لاعبين الغرفة (Room Players)
-- ============================================
CREATE TABLE public.room_players (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  score INTEGER DEFAULT 0,
  is_ready BOOLEAN DEFAULT FALSE,
  role TEXT, -- الدور في اللعبة (مثلاً الكذاب)
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, player_id)
);

ALTER TABLE public.room_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "أي شخص يشوف لاعبين الغرفة" ON public.room_players
  FOR SELECT USING (true);

CREATE POLICY "المستخدم يقدر يدخل غرفة" ON public.room_players
  FOR INSERT WITH CHECK (auth.uid() = player_id);

CREATE POLICY "المستخدم يقدر يعدل بياناته" ON public.room_players
  FOR UPDATE USING (auth.uid() = player_id);

-- ============================================
-- 4. جدول سجل الألعاب (Game History)
-- ============================================
CREATE TABLE public.game_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  game_type TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  is_winner BOOLEAN DEFAULT FALSE,
  xp_earned INTEGER DEFAULT 0,
  played_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.game_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "المستخدم يشوف تاريخ ألعابه" ON public.game_history
  FOR SELECT USING (auth.uid() = player_id);

CREATE POLICY "النظام يسجل النتائج" ON public.game_history
  FOR INSERT WITH CHECK (auth.uid() = player_id);

-- ============================================
-- 5. جدول كلمات Wordle
-- ============================================
CREATE TABLE public.wordle_words (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  word TEXT NOT NULL,
  date DATE UNIQUE NOT NULL,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  hint TEXT
);

ALTER TABLE public.wordle_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "أي شخص يقرأ الكلمات" ON public.wordle_words
  FOR SELECT USING (true);

-- ============================================
-- 6. جدول المعاملات المالية (Transactions)
-- ============================================
CREATE TABLE public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'spend', 'reward', 'subscription')),
  amount DECIMAL(10,2) DEFAULT 0, -- المبلغ بالريال
  coins_amount INTEGER DEFAULT 0, -- عدد الفيش
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  moyasar_id TEXT, -- رقم العملية في Moyasar
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "المستخدم يشوف معاملاته" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- Functions & Triggers
-- ============================================

-- تحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- إنشاء بروفايل تلقائي عند التسجيل
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || LEFT(NEW.id::TEXT, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'لاعب جديد')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_rooms_code ON public.rooms(code);
CREATE INDEX idx_rooms_status ON public.rooms(status);
CREATE INDEX idx_rooms_game_type ON public.rooms(game_type);
CREATE INDEX idx_room_players_room ON public.room_players(room_id);
CREATE INDEX idx_game_history_player ON public.game_history(player_id);
CREATE INDEX idx_wordle_date ON public.wordle_words(date);

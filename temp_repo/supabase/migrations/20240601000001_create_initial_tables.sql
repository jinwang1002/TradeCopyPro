-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('provider', 'subscriber')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create signal_accounts table
CREATE TABLE IF NOT EXISTS public.signal_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  broker TEXT,
  account_number TEXT,
  monthly_fee DECIMAL(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trade_accounts table
CREATE TABLE IF NOT EXISTS public.trade_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users NOT NULL,
  name TEXT NOT NULL,
  broker TEXT,
  account_number TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID REFERENCES public.users NOT NULL,
  signal_account_id UUID REFERENCES public.signal_accounts NOT NULL,
  status TEXT CHECK (status IN ('active', 'trial', 'expired', 'cancelled')) DEFAULT 'trial',
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  lot_size_multiplier DECIMAL(10, 2) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subscriber_id, signal_account_id)
);

-- Create subscription_trade_accounts table (junction table)
CREATE TABLE IF NOT EXISTS public.subscription_trade_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID REFERENCES public.subscriptions NOT NULL,
  trade_account_id UUID REFERENCES public.trade_accounts NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subscription_id, trade_account_id)
);

-- Create trades table
CREATE TABLE IF NOT EXISTS public.trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  signal_account_id UUID REFERENCES public.signal_accounts NOT NULL,
  symbol TEXT NOT NULL,
  type TEXT CHECK (type IN ('Buy', 'Sell')) NOT NULL,
  open_price DECIMAL(10, 5) NOT NULL,
  current_price DECIMAL(10, 5),
  stop_loss DECIMAL(10, 5),
  take_profit DECIMAL(10, 5),
  lot_size DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('Open', 'Closed')) DEFAULT 'Open',
  profit DECIMAL(10, 2),
  open_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  close_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create copied_trades table
CREATE TABLE IF NOT EXISTS public.copied_trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trade_id UUID REFERENCES public.trades NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions NOT NULL,
  trade_account_id UUID REFERENCES public.trade_accounts NOT NULL,
  lot_size DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('Open', 'Closed')) DEFAULT 'Open',
  profit DECIMAL(10, 2),
  open_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  close_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users NOT NULL,
  signal_account_id UUID REFERENCES public.signal_accounts NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create performance_stats table
CREATE TABLE IF NOT EXISTS public.performance_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  signal_account_id UUID REFERENCES public.signal_accounts NOT NULL,
  period TEXT CHECK (period IN ('daily', 'weekly', 'monthly', 'yearly', 'all_time')) NOT NULL,
  return_percentage DECIMAL(10, 2),
  win_rate DECIMAL(5, 2),
  drawdown DECIMAL(10, 2),
  total_trades INTEGER,
  winning_trades INTEGER,
  losing_trades INTEGER,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(signal_account_id, period)
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signal_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_trade_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copied_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_stats ENABLE ROW LEVEL SECURITY;

-- Create basic policies
-- Users can read their own data
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Signal accounts policies
DROP POLICY IF EXISTS "Users can view their own signal accounts" ON public.signal_accounts;
CREATE POLICY "Users can view their own signal accounts"
  ON public.signal_accounts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Trade accounts policies
DROP POLICY IF EXISTS "Users can view their own trade accounts" ON public.trade_accounts;
CREATE POLICY "Users can view their own trade accounts"
  ON public.trade_accounts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Enable realtime for all tables
alter publication supabase_realtime add table public.users;
alter publication supabase_realtime add table public.signal_accounts;
alter publication supabase_realtime add table public.trade_accounts;
alter publication supabase_realtime add table public.subscriptions;
alter publication supabase_realtime add table public.subscription_trade_accounts;
alter publication supabase_realtime add table public.trades;
alter publication supabase_realtime add table public.copied_trades;
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.performance_stats;
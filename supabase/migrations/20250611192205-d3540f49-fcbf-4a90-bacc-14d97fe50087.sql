
-- Create table for persistent users
CREATE TABLE public.persistent_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for assistant activities
CREATE TABLE public.assistant_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('search', 'analysis', 'suggestion')),
  title TEXT NOT NULL,
  description TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  FOREIGN KEY (user_id) REFERENCES public.persistent_users(user_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_persistent_users_status ON public.persistent_users(status);
CREATE INDEX idx_persistent_users_last_active ON public.persistent_users(last_active);
CREATE INDEX idx_assistant_activities_user_id ON public.assistant_activities(user_id);
CREATE INDEX idx_assistant_activities_created_at ON public.assistant_activities(created_at);

-- Enable Row Level Security
ALTER TABLE public.persistent_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistant_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public access for this demo)
CREATE POLICY "Allow all operations on persistent_users" 
  ON public.persistent_users 
  FOR ALL 
  USING (true);

CREATE POLICY "Allow all operations on assistant_activities" 
  ON public.assistant_activities 
  FOR ALL 
  USING (true);

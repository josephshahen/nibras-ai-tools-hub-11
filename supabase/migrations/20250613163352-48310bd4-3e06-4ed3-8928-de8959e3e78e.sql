
-- Add recommendations table for storing AI-found content
CREATE TABLE public.recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  category TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  FOREIGN KEY (user_id) REFERENCES public.persistent_users(user_id) ON DELETE CASCADE
);

-- Create index for better performance
CREATE INDEX idx_recommendations_user_id ON public.recommendations(user_id);
CREATE INDEX idx_recommendations_created_at ON public.recommendations(created_at);

-- Enable Row Level Security
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for recommendations
CREATE POLICY "Allow all operations on recommendations" 
  ON public.recommendations 
  FOR ALL 
  USING (true);

-- Remove the 30-day auto-cleanup by modifying the background task
-- The edge function will no longer expire users automatically

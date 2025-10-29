-- Create tables for community chat and live locations

-- Chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for chat (everyone can read, authenticated users can insert)
CREATE POLICY "Anyone can read chat messages"
  ON public.chat_messages FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert chat messages"
  ON public.chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Live locations table
CREATE TABLE IF NOT EXISTS public.live_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('donor', 'receiver')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  unique_code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.live_locations ENABLE ROW LEVEL SECURITY;

-- RLS policies for locations
CREATE POLICY "Anyone can read active locations"
  ON public.live_locations FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert their location"
  ON public.live_locations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own location"
  ON public.live_locations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own location"
  ON public.live_locations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_locations;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for live_locations
CREATE TRIGGER update_live_locations_updated_at
  BEFORE UPDATE ON public.live_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
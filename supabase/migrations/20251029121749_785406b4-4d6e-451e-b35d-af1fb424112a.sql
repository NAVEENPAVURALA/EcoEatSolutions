-- Create donations table
CREATE TABLE IF NOT EXISTS public.donations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  food_type text NOT NULL,
  quantity text NOT NULL,
  pickup_location text NOT NULL,
  available_until timestamp with time zone NOT NULL,
  contact_phone text,
  status text NOT NULL DEFAULT 'available',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view available donations"
ON public.donations
FOR SELECT
USING (status = 'available' OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can create donations"
ON public.donations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own donations"
ON public.donations
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own donations"
ON public.donations
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_donations_updated_at
BEFORE UPDATE ON public.donations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
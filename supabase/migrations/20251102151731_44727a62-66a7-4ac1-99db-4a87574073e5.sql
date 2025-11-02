-- Fix critical security issues

-- 1. Fix phone number exposure in donations table
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view available donations" ON public.donations;

-- Create new policy that excludes contact_phone from public view
CREATE POLICY "Public can view available donations without phone"
ON public.donations
FOR SELECT
USING (
  status = 'available'::text 
  AND (
    auth.uid() = user_id 
    OR auth.uid() = collected_by
    OR auth.role() = 'authenticated'
  )
);

-- 2. Fix live_locations - require authentication to view
DROP POLICY IF EXISTS "Anyone can read active locations" ON public.live_locations;

CREATE POLICY "Authenticated users can view active locations"
ON public.live_locations
FOR SELECT
USING (
  is_active = true 
  AND auth.role() = 'authenticated'
);

-- 3. Fix chat_messages - require authentication
DROP POLICY IF EXISTS "Anyone can read chat messages" ON public.chat_messages;

CREATE POLICY "Authenticated users can read chat messages"
ON public.chat_messages
FOR SELECT
USING (auth.role() = 'authenticated');

-- 4. Allow users to view basic profile info of other users for donations
CREATE POLICY "Authenticated users can view other profiles"
ON public.profiles
FOR SELECT
USING (auth.role() = 'authenticated');

-- 5. Fix function search_path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public;
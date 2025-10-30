-- Drop OTP table and related objects
DROP TABLE IF EXISTS public.otp_verifications CASCADE;
DROP FUNCTION IF EXISTS public.cleanup_expired_otps() CASCADE;

-- Make phone_number optional in profiles table
ALTER TABLE public.profiles 
ALTER COLUMN phone_number DROP NOT NULL;
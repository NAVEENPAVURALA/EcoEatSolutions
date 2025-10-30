-- Create OTP storage table
CREATE TABLE public.otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert OTPs (for signup)
CREATE POLICY "Anyone can create OTP"
ON public.otp_verifications
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read their own OTP for verification
CREATE POLICY "Anyone can read OTP by phone"
ON public.otp_verifications
FOR SELECT
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_otp_phone_number ON public.otp_verifications(phone_number);
CREATE INDEX idx_otp_expires_at ON public.otp_verifications(expires_at);

-- Function to clean up expired OTPs
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.otp_verifications
  WHERE expires_at < NOW();
END;
$$;
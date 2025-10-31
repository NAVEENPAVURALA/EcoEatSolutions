-- Add function to automatically delete chat messages older than 1 hour
CREATE OR REPLACE FUNCTION delete_old_chat_messages()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.chat_messages
  WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$;

-- Create a trigger to run cleanup periodically (via pg_cron would be ideal, but we'll handle via application logic)
-- Add index for efficient cleanup queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);

-- Add collected_by field to donations table to track when donations are collected
ALTER TABLE public.donations
ADD COLUMN IF NOT EXISTS collected_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS collected_at timestamp with time zone;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON public.donations(user_id);
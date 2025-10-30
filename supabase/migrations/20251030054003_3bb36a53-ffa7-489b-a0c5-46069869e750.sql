-- Update the profile creation trigger to handle optional phone number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, user_type, organization_name, phone_number)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'user_type',
    NEW.raw_user_meta_data->>'organization_name',
    COALESCE(NEW.raw_user_meta_data->>'phone_number', NEW.phone)
  );
  RETURN NEW;
END;
$$;
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { message } = await req.json();

    // Fetch all profiles with phone numbers
    const { data: profiles, error: fetchError } = await supabaseClient
      .from('profiles')
      .select('phone_number, full_name')
      .not('phone_number', 'is', null);

    if (fetchError) {
      console.error('Error fetching profiles:', fetchError);
      throw fetchError;
    }

    console.log(`Sending emergency alerts to ${profiles?.length || 0} users`);

    // Note: In production, you would integrate with an SMS service like Twilio
    // For now, we'll log the alert and return success
    // Example Twilio integration would go here:
    /*
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    for (const profile of profiles || []) {
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: profile.phone_number,
          From: twilioPhoneNumber,
          Body: `${message} - EcoEatSolutions`
        }),
      });
    }
    */

    // Log alerts for demonstration
    profiles?.forEach((profile) => {
      console.log(`Alert to ${profile.full_name} (${profile.phone_number}): ${message}`);
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Emergency alert queued for ${profiles?.length || 0} users`,
        note: 'SMS integration requires Twilio configuration'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in emergency-alert function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

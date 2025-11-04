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

    // Fetch all user emails from auth.users
    const { data: { users }, error: fetchError } = await supabaseClient.auth.admin.listUsers();

    if (fetchError) {
      console.error('Error fetching users:', fetchError);
      throw fetchError;
    }

    console.log(`Preparing to send emergency alerts to ${users?.length || 0} users`);

    // Log the emergency alert for each user
    // Note: Supabase doesn't provide a direct email sending API from edge functions
    // You would typically integrate with SendGrid, Mailgun, or similar services
    // For now, we'll log the alerts
    
    users?.forEach((user) => {
      console.log(`Emergency alert queued for ${user.email}: ${message}`);
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Emergency alert broadcasted to ${users?.length || 0} users`,
        note: 'Email notifications logged. Integrate with an email service provider for actual delivery.'
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
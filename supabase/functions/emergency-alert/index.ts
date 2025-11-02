import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    // Send email to all users
    const emailPromises = users?.map(user =>
      resend.emails.send({
        from: "Food Share Emergency Alert <onboarding@resend.dev>",
        to: [user.email!],
        subject: "🚨 EMERGENCY: Urgent Food Distribution Alert",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">⚠️ EMERGENCY ALERT</h1>
            </div>
            <div style="padding: 20px; border: 2px solid #dc2626; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="font-size: 18px; font-weight: bold; color: #dc2626;">URGENT FOOD DISTRIBUTION NEEDED</p>
              <p style="font-size: 16px; line-height: 1.6;">${message}</p>
              
              <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold;">Immediate Action Required:</p>
                <ul style="margin: 10px 0;">
                  <li>Donors: Please consider making emergency donations</li>
                  <li>Organizations: Coordinate immediate distribution efforts</li>
                  <li>Receivers: Check for emergency food availability</li>
                </ul>
              </div>
              
              <p>Please log in to Food Share immediately to respond to this emergency.</p>
              
              <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                This is an automated emergency alert from Food Share. Only activate Emergency Mode for genuine urgent situations.
              </p>
            </div>
          </div>
        `,
      })
    ) || [];

    await Promise.all(emailPromises);

    console.log(`Emergency alert emails sent to ${users?.length || 0} users`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Emergency alert broadcasted to ${users?.length || 0} users`,
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
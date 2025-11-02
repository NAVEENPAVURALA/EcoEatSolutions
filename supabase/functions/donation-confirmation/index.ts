import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DonationConfirmationRequest {
  donorEmail: string;
  donorName: string;
  title: string;
  foodType: string;
  quantity: string;
  pickupLocation: string;
  availableUntil: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { donorEmail, donorName, title, foodType, quantity, pickupLocation, availableUntil }: DonationConfirmationRequest = await req.json();

    console.log("Sending donation confirmation to:", donorEmail);

    const emailResponse = await resend.emails.send({
      from: "Food Share <onboarding@resend.dev>",
      to: [donorEmail],
      subject: "Thank You for Your Donation - Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">Thank You for Your Donation!</h1>
          <p>Dear ${donorName},</p>
          <p>Your generous donation has been successfully registered. Here are the details:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Donation Details</h2>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Food Type:</strong> ${foodType}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Pickup Location:</strong> ${pickupLocation}</p>
            <p><strong>Available Until:</strong> ${new Date(availableUntil).toLocaleString()}</p>
          </div>
          
          <p>Your donation will help feed those in need. We will notify you when someone collects the food.</p>
          <p>Together, we're making a difference in our community!</p>
          
          <p style="margin-top: 30px;">Best regards,<br><strong>Food Share Team</strong></p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending donation confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

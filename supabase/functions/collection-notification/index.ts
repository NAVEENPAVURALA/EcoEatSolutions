import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CollectionNotificationRequest {
  donorEmail: string;
  donorName: string;
  collectorEmail: string;
  collectorName: string;
  title: string;
  quantity: string;
  collectedAt: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      donorEmail, 
      donorName, 
      collectorEmail, 
      collectorName, 
      title, 
      quantity, 
      collectedAt 
    }: CollectionNotificationRequest = await req.json();

    console.log("Sending collection notifications to donor and collector");

    // Send email to donor
    const donorEmailResponse = await resend.emails.send({
      from: "Food Share <onboarding@resend.dev>",
      to: [donorEmail],
      subject: "Your Donation Has Been Collected!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">Great News! Your Donation Was Collected</h1>
          <p>Dear ${donorName},</p>
          <p>We're happy to inform you that your donation has been successfully collected!</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Collection Details</h2>
            <p><strong>Donation:</strong> ${title}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Collected By:</strong> ${collectorName}</p>
            <p><strong>Collected At:</strong> ${new Date(collectedAt).toLocaleString()}</p>
          </div>
          
          <p>Thank you for your generosity! Your contribution is helping to reduce food waste and feed those in need.</p>
          
          <p style="margin-top: 30px;">Best regards,<br><strong>Food Share Team</strong></p>
        </div>
      `,
    });

    // Send email to collector
    const collectorEmailResponse = await resend.emails.send({
      from: "Food Share <onboarding@resend.dev>",
      to: [collectorEmail],
      subject: "Food Collection Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">Collection Confirmed!</h1>
          <p>Dear ${collectorName},</p>
          <p>Your food collection has been successfully registered.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Collection Details</h2>
            <p><strong>Donation:</strong> ${title}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Donor:</strong> ${donorName}</p>
            <p><strong>Collected At:</strong> ${new Date(collectedAt).toLocaleString()}</p>
          </div>
          
          <p>Thank you for helping reduce food waste and supporting those in need!</p>
          
          <p style="margin-top: 30px;">Best regards,<br><strong>Food Share Team</strong></p>
        </div>
      `,
    });

    console.log("Emails sent successfully");

    return new Response(
      JSON.stringify({ 
        donorEmail: donorEmailResponse, 
        collectorEmail: collectorEmailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending collection notifications:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

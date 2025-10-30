import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const EmergencyMode = () => {
  const [loading, setLoading] = useState(false);

  const activateEmergencyMode = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('emergency-alert', {
        body: { message: "Emergency food distribution activated! Urgent need for donations." }
      });

      if (error) throw error;

      toast.success("Emergency alert sent to all registered users!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send emergency alert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          Emergency Mode
        </CardTitle>
        <CardDescription>
          Activate to send urgent email alerts to all registered donors and organizations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full" size="lg">
              Activate Emergency Mode
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will send an email alert to all registered users including donors,
                NGOs, and receivers. Only use this for genuine emergencies requiring immediate
                food distribution.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={activateEmergencyMode}
                disabled={loading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {loading ? "Sending..." : "Confirm Emergency Alert"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart } from "lucide-react";

const Donate = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Post a Donation</h1>
          <p className="text-muted-foreground">
            Share your surplus food with those in need
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Create Donation Listing
            </CardTitle>
            <CardDescription>
              Fill out the form below to post your food donation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p>Donation form coming soon.</p>
              <p className="text-sm mt-2">This feature is under development.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Donate;
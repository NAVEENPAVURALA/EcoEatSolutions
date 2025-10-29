import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search } from "lucide-react";

const Browse = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Donations</h1>
          <p className="text-muted-foreground">
            Find available food donations in your area
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Available Donations
            </CardTitle>
            <CardDescription>
              Browse and request food donations from restaurants and individuals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p>No donations available at the moment.</p>
              <p className="text-sm mt-2">Check back later for new donations.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Browse;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Package, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BackToHomeButton } from "@/components/BackToHomeButton";

interface Donation {
  id: string;
  title: string;
  description: string;
  food_type: string;
  quantity: string;
  pickup_location: string;
  available_until: string;
  contact_phone: string | null;
  status: string;
  created_at: string;
  user_id: string;
}

const Browse = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [collectingId, setCollectingId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    fetchDonations();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setIsAuthenticated(true);
      setUserId(session.user.id);
    }
  };

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error: any) {
      toast.error("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  const handleCollectDonation = async (donationId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to collect donations");
      navigate("/login");
      return;
    }

    setCollectingId(donationId);
    try {
      const donation = donations.find(d => d.id === donationId);
      
      const { error } = await supabase
        .from("donations")
        .update({
          status: "collected",
          collected_by: userId,
          collected_at: new Date().toISOString()
        })
        .eq("id", donationId);

      if (error) throw error;

      toast.success("Donation collected successfully!");
      setDonations(donations.filter(d => d.id !== donationId));
    } catch (error: any) {
      toast.error("Failed to collect donation");
      console.error("Error:", error);
    } finally {
      setCollectingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFoodTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "vegetarian":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "vegan":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
      case "non-vegetarian":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <BackToHomeButton />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Donations</h1>
          <p className="text-muted-foreground">
            Find available food donations near you
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : donations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-2">No donations available yet</p>
              <p className="text-sm text-muted-foreground">Check back later for new food donations</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <Card key={donation.id} className="hover:shadow-lg transition-all border-2 hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-xl">{donation.title}</CardTitle>
                    <Badge className={getFoodTypeBadgeColor(donation.food_type)}>
                      {donation.food_type}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {donation.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>{donation.quantity}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{donation.pickup_location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Until {formatDate(donation.available_until)}</span>
                  </div>

                  {donation.contact_phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{donation.contact_phone}</span>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary/90" 
                      onClick={() => handleCollectDonation(donation.id)}
                      disabled={collectingId === donation.id}
                    >
                      {collectingId === donation.id ? "Collecting..." : "Collect Donation"}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Contact Donor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;

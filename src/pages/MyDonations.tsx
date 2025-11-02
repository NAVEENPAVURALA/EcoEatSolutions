import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Package, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { BackToHomeButton } from "@/components/BackToHomeButton";
import { useTranslation } from "react-i18next";

interface Donation {
  id: string;
  title: string;
  description: string;
  food_type: string;
  quantity: string;
  pickup_location: string;
  available_until: string;
  status: string;
  created_at: string;
}

const MyDonations = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
    fetchMyDonations(session.user.id);
  };

  const fetchMyDonations = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error: any) {
      toast.error("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("donations")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Donation deleted successfully");
      setDonations(donations.filter(d => d.id !== id));
    } catch (error: any) {
      toast.error("Failed to delete donation");
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

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      available: "bg-green-500/10 text-green-700 dark:text-green-400",
      collected: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      expired: "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    };
    return colors[status] || colors.available;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <BackToHomeButton />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('dashboard.myDonations')}</h1>
          <p className="text-muted-foreground">
            View and manage all your food donations
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
              <p className="text-lg text-muted-foreground mb-2">No donations yet</p>
              <p className="text-sm text-muted-foreground mb-4">Start making a difference by donating food</p>
              <Button onClick={() => navigate("/donate/post")}>
                Post Your First Donation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <Card key={donation.id} className="hover:shadow-lg transition-all border-2">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-xl">{donation.title}</CardTitle>
                    <Badge className={getStatusBadge(donation.status)}>
                      {donation.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {donation.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{donation.food_type}</Badge>
                  </div>
                  
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

                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(donation.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
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

export default MyDonations;

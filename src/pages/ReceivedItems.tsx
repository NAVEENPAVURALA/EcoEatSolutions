import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Package, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { BackToHomeButton } from "@/components/BackToHomeButton";
import { useTranslation } from "react-i18next";

interface ReceivedItem {
  id: string;
  title: string;
  description: string;
  food_type: string;
  quantity: string;
  pickup_location: string;
  collected_at: string;
}

const ReceivedItems = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [items, setItems] = useState<ReceivedItem[]>([]);
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
    fetchReceivedItems(session.user.id);
  };

  const fetchReceivedItems = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .eq("collected_by", userId)
        .eq("status", "collected")
        .order("collected_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast.error("Failed to load received items");
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <BackToHomeButton />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('dashboard.receivedItems')}</h1>
          <p className="text-muted-foreground">
            View all the food donations you've collected
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-2">No received items yet</p>
              <p className="text-sm text-muted-foreground mb-4">Browse available donations and start collecting</p>
              <Button onClick={() => navigate("/browse")}>
                Browse Donations
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-all border-2">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                      Collected
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{item.food_type}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>{item.quantity}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{item.pickup_location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Collected: {formatDate(item.collected_at)}</span>
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

export default ReceivedItems;

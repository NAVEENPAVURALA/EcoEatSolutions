import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Package } from "lucide-react";

interface Donation {
  id: string;
  title: string;
  food_type: string;
  quantity: string;
  pickup_location: string;
  created_at: string;
  status: string;
}

export const RecentDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    fetchRecentDonations();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('recent-donations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'donations'
        },
        (payload) => {
          console.log('New donation received:', payload);
          setDonations(prev => [payload.new as Donation, ...prev].slice(0, 5));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRecentDonations = async () => {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching recent donations:', error);
    } else {
      setDonations(data || []);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (donations.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Latest Donations
            <span className="ml-3 inline-flex items-center">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </span>
          </h2>
          <p className="text-muted-foreground">Real-time updates of recent food donations</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {donations.map((donation) => (
            <Card key={donation.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg line-clamp-1">{donation.title}</h3>
                  <Badge variant="secondary" className="ml-2 shrink-0">
                    <Clock className="w-3 h-3 mr-1" />
                    {getTimeAgo(donation.created_at)}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{donation.food_type}</span>
                    <span>•</span>
                    <span>{donation.quantity}</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{donation.pickup_location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

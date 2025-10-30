import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LogOut, Plus, Heart, TrendingUp, Users, Leaf, Home } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { BackToHomeButton } from "@/components/BackToHomeButton";
import { EmergencyMode } from "@/components/EmergencyMode";

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setUserType(session.user.user_metadata.user_type || "individual");
        setFullName(session.user.user_metadata.full_name || "User");
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getDashboardContent = () => {
    switch (userType) {
      case "restaurant":
        return {
          title: "Restaurant Dashboard",
          stats: [
            { label: "Total Donations", value: "0", icon: Heart, color: "text-primary" },
            { label: "Meals Donated", value: "0", icon: TrendingUp, color: "text-secondary" },
            { label: "Impact Score", value: "0", icon: Leaf, color: "text-accent" }
          ],
          quickActions: [
            { label: "Post New Donation", action: () => navigate("/donate/post"), variant: "default" as const }
          ]
        };
      case "organization":
        return {
          title: "Organization Dashboard",
          stats: [
            { label: "Active Requests", value: "0", icon: Heart, color: "text-primary" },
            { label: "Received Donations", value: "0", icon: TrendingUp, color: "text-secondary" },
            { label: "People Fed", value: "0", icon: Users, color: "text-accent" }
          ],
          quickActions: [
            { label: "Browse Donations", action: () => navigate("/browse"), variant: "default" as const },
            { label: "Create Request", action: () => navigate("/request"), variant: "outline" as const }
          ]
        };
      default:
        return {
          title: "Individual Dashboard",
          stats: [
            { label: "Donations Made", value: "0", icon: Heart, color: "text-primary" },
            { label: "Meals Shared", value: "0", icon: TrendingUp, color: "text-secondary" },
            { label: "Community Impact", value: "0", icon: Leaf, color: "text-accent" }
          ],
          quickActions: [
            { label: "Donate Food", action: () => navigate("/donate/post"), variant: "default" as const },
            { label: "Browse Requests", action: () => navigate("/browse"), variant: "outline" as const }
          ]
        };
    }
  };

  const content = getDashboardContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <BackToHomeButton />
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-primary">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">EcoEatSolutions</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {fullName}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-bold mb-2">{content.title}</h2>
            <p className="text-muted-foreground">
              Track your impact and manage your {userType === "restaurant" ? "donations" : userType === "organization" ? "requests" : "contributions"}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            {content.quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                size="lg"
                onClick={action.action}
                className={action.variant === "default" ? "gradient-primary" : ""}
              >
                <Plus className="w-4 h-4 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {content.stats.map((stat, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription>{stat.label}</CardDescription>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest {userType === "restaurant" ? "donations" : "actions"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>No recent activity yet.</p>
                <p className="text-sm mt-2">
                  {userType === "restaurant" 
                    ? "Start by posting your first donation!" 
                    : userType === "organization"
                    ? "Browse available donations or create a request."
                    : "Start donating food to see your impact here."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Mode - Admin Only */}
          {userType === "organization" && (
            <EmergencyMode />
          )}

          {/* Impact Summary */}
          <Card className="gradient-hero text-white">
            <CardHeader>
              <CardTitle>Your Impact Summary</CardTitle>
              <CardDescription className="text-white/80">
                Making a difference in your community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm opacity-90">Environmental Impact</div>
                  <div className="text-2xl font-bold mt-1">0 kg CO₂ saved</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Community Reach</div>
                  <div className="text-2xl font-bold mt-1">0 people helped</div>
                </div>
              </div>
              <p className="text-sm opacity-80 pt-4">
                Every donation helps reduce food waste and feeds those in need. Keep up the great work!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

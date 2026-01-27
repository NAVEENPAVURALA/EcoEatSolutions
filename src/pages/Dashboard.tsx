import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LogOut, Plus, Heart, TrendingUp, Users, Leaf, Home } from "lucide-react";
import { BackToHomeButton } from "@/components/BackToHomeButton";
import { EmergencyMode } from "@/components/EmergencyMode";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [stats, setStats] = useState({
    donations: 0,
    meals: 0,
    impact: 0,
    co2Saved: 0,
    peopleHelped: 0
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFullName(user.displayName || "User");

        // Fetch user type from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserType(userDoc.data().user_type || "individual");
          }
          await fetchUserStats(user.uid);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUserStats = async (userId: string) => {
    try {
      const q = query(collection(db, "donations"), where("user_id", "==", userId));
      const querySnapshot = await getDocs(q);
      const donationsCount = querySnapshot.size;

      let totalMeals = 0;
      querySnapshot.forEach((doc) => {
        const donation = doc.data();
        const quantityStr = donation.quantity.toLowerCase();
        const match = quantityStr.match(/(\d+\.?\d*)/);
        if (match) {
          const amount = parseFloat(match[1]);
          if (quantityStr.includes("kg")) {
            totalMeals += amount * 4;
          } else if (quantityStr.includes("gm") || quantityStr.includes("g")) {
            totalMeals += (amount / 1000) * 4;
          }
        }
      });

      // Calculate CO2 saved (rough estimate: 1kg food = 2.5kg CO2)
      const co2Saved = Math.round((totalMeals / 4) * 2.5);
      const peopleHelped = Math.round(totalMeals / 3); // Assuming 3 meals per person

      setStats({
        donations: donationsCount || 0,
        meals: Math.round(totalMeals),
        impact: donationsCount || 0,
        co2Saved,
        peopleHelped
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
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
            { label: "Total Donations", value: stats.donations.toString(), icon: Heart, color: "text-primary" },
            { label: "Meals Donated", value: stats.meals.toString(), icon: TrendingUp, color: "text-secondary" },
            { label: "Impact Score", value: stats.impact.toString(), icon: Leaf, color: "text-accent" }
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
            { label: "Received Donations", value: stats.donations.toString(), icon: TrendingUp, color: "text-secondary" },
            { label: "People Fed", value: stats.peopleHelped.toString(), icon: Users, color: "text-accent" }
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
            { label: "Donations Made", value: stats.donations.toString(), icon: Heart, color: "text-primary" },
            { label: "Meals Shared", value: stats.meals.toString(), icon: TrendingUp, color: "text-secondary" },
            { label: "Community Impact", value: stats.impact.toString(), icon: Leaf, color: "text-accent" }
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
                  <div className="text-2xl font-bold mt-1">{stats.co2Saved} kg CO₂ saved</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Community Reach</div>
                  <div className="text-2xl font-bold mt-1">{stats.peopleHelped} people helped</div>
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

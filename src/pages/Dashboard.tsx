import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { query, collection, where, getDocs, orderBy, limit, doc, getDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Utensils, Heart, ArrowRight, User, Settings, Sparkles, Clock, Leaf, Package, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRGenerator } from "@/components/QRGenerator";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState({
    activeDonations: 0,
    completedDonations: 0,
    impactScore: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [qrDonationId, setQrDonationId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);

      try {
        // Fetch User Profile
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        // Fetch Stats
        const q = query(
          collection(db, "donations"),
          where("userId", "==", currentUser.uid),
          orderBy("created_at", "desc"),
          limit(5)
        );
        const querySnapshot = await getDocs(q);

        const donations = querySnapshot.docs.map(doc => doc.data());
        setRecentActivity(donations);
        setStats({
          activeDonations: donations.filter(d => d.status === "available").length,
          completedDonations: donations.filter(d => d.status === "claimed").length,
          impactScore: donations.length * 10
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container mx-auto p-8 space-y-8 animate-pulse">
        <div className="h-12 w-1/3 bg-muted rounded-lg" />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-2xl" />)}
        </div>
        <div className="h-64 bg-muted rounded-2xl" />
      </div>
    )
  }

  const userType = userData?.user_type || "individual";

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hello, {userData?.full_name?.split(" ")[0] || "Friend"}
          </h1>
          <p className="text-muted-foreground">
            Here's your impact overview for today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="rounded-full gap-2">
            <User className="w-4 h-4" />
            Profile
          </Button>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Quick Actions Card */}
        <Card className="md:col-span-2 glass-card border-none bg-gradient-to-br from-primary/5 to-blue-500/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4 relative z-10">
            {userType === "restaurant" || userType === "individual" ? (
              <Button
                size="lg"
                className="h-14 text-lg bg-primary hover:bg-primary/90 shadow-glow group"
                onClick={() => navigate("/donate/post")}
              >
                <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
                Donate Food
              </Button>
            ) : (
              <Button
                size="lg"
                className="h-14 text-lg bg-primary hover:bg-primary/90 shadow-glow"
                onClick={() => navigate("/request")}
              >
                <Utensils className="mr-2 h-5 w-5" />
                Request Food
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              className="h-14 text-lg bg-white/50 hover:bg-white/80"
              onClick={() => navigate("/browse")}
            >
              <Search className="mr-2 h-5 w-5" />
              Browse Listings
            </Button>
          </CardContent>
        </Card>

        {/* Impact Score Card */}
        <Card className="glass-card flex flex-col justify-center items-center text-center p-6 bg-gradient-to-br from-amber-100/50 to-orange-100/50 border-orange-200/50">
          <div className="p-4 bg-orange-100 rounded-full text-orange-600 mb-4">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <div className="text-4xl font-bold mb-1">{stats.impactScore}</div>
          <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Impact Score</div>
          <p className="text-xs text-muted-foreground mt-2">Top 10% in your area!</p>
        </Card>

        {/* Stats Row */}
        <Card className="glass-card p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.activeDonations}</div>
            <div className="text-sm text-muted-foreground">Active Listings</div>
          </div>
        </Card>

        <Card className="glass-card p-6 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-xl">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.completedDonations}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </Card>

        <Card className="glass-card p-6 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">12h</div>
            <div className="text-sm text-muted-foreground">Avg. Pickup Time</div>
          </div>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        Recent Activity
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      </h2>

      <div className="space-y-4">
        {recentActivity.length > 0 ? (
          recentActivity.map((d, i) => (
            <div key={i} className="group flex items-center justify-between p-4 rounded-xl bg-white border border-border/50 hover:border-primary/50 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/50 flex items-center justify-center">
                  {d.type === "veg" ? "🥗" : "🍗"}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{d.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{new Date(d.created_at).toLocaleDateString()}</span>
                    {d.status === "available" && (
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1 ml-2 text-primary" onClick={() => setQrDonationId(d.userId + ":" + d.title)}>
                        <QrCode className="w-3 h-3" /> Show QR
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${d.status === "available" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}>
                {d.status}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border/50 rounded-2xl">
            <div className="p-4 bg-secondary/50 rounded-full mb-4">
              <Package className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-lg font-medium text-foreground">No activity yet</p>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
              Your journey starts with a single step. Make your first contribution today.
            </p>
            <Button variant="outline" onClick={() => navigate("/donate/post")}>Post Donation</Button>
          </div>
        )}
      </div>

      <Dialog open={!!qrDonationId} onOpenChange={() => setQrDonationId(null)}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-center pb-4 border-b">Verification Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 bg-secondary/10 rounded-xl">
            <p className="mb-4 text-center text-muted-foreground text-sm">
              Show this to the volunteer/recipient to verify the transaction.
            </p>
            {qrDonationId && (
              <QRGenerator value={`verify:${qrDonationId}`} label="Scan to Verify" />
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Dashboard;

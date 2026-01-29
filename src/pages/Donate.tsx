import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Upload, ChefHat, MapPin, Calendar } from "lucide-react";
import vegImg from "@/assets/veg-food.png";
import nonVegImg from "@/assets/non-veg-food.png";
import bakeryImg from "@/assets/bakery-food.png";

/**
 * Premium single-column donation form.
 * Focuses on clarity and ease of use.
 */
const Donate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    type: "veg",
    pickupTime: "",
    address: ""
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        toast.error("Please login to donate");
        navigate("/login");
        return;
      }
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.quantity || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "donations"), {
        ...formData,
        userId: user.uid,
        status: "available",
        created_at: new Date().toISOString(),
        userName: user.displayName || "Anonymous Donor"
      });

      toast.success("Donation posted successfully! Thank you.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error posting donation:", error);
      toast.error("Failed to post donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 py-12 px-4 relative">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">

        {/* Header */}
        <div>
          <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Share Food</h1>
          <p className="text-muted-foreground text-lg">
            Details help us connect you with the right community partner.
          </p>
        </div>

        {/* Form Card */}
        <Card className="glass-card shadow-xl border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              Food Details
            </CardTitle>
            <CardDescription>What are you donating today?</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Essential Details Section */}
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Food Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., 20 Packets of Fresh Rice & Curry"
                    className="h-12 bg-white/50"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select onValueChange={(val) => setFormData({ ...formData, type: val })} defaultValue="veg">
                      <SelectTrigger className="h-12 bg-white/50">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="veg">Vegetarian</SelectItem>
                        <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                        <SelectItem value="bakery">Bakery/Dry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      placeholder="e.g., 5kg or 20 meals"
                      className="h-12 bg-white/50"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="desc">Description & Instructions</Label>
                  <Textarea
                    id="desc"
                    placeholder="List ingredients, allergens, or packaging details..."
                    className="min-h-[100px] bg-white/50 resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Visual Preview */}
                <div className="p-4 rounded-xl bg-secondary/20 border border-border/50 flex items-center gap-4 animate-fade-in">
                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-white shadow-sm shrink-0">
                    <img
                      src={formData.type === "non-veg" ? nonVegImg : formData.type === "bakery" ? bakeryImg : vegImg}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Category Visual</p>
                    <p className="text-xs text-muted-foreground">This illustration will be shown to recipients.</p>
                  </div>
                </div>
              </div>

              {/* Logistics Section */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  <MapPin className="w-4 h-4" /> Logistics
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Pickup Address</Label>
                  <Input
                    id="address"
                    placeholder="Full street address for pickup"
                    className="h-12 bg-white/50"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="time">Preferred Pickup Time</Label>
                  <div className="relative">
                    <Input
                      id="time"
                      placeholder="e.g., Before 8 PM today"
                      className="h-12 bg-white/50 pl-10"
                      value={formData.pickupTime}
                      onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/3 h-12"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-2/3 h-12 bg-primary hover:bg-primary/90 shadow-glow text-lg"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Post Donation"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Donate;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Heart, Calendar, MapPin, Phone, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BackToHomeButton } from "@/components/BackToHomeButton";
import { ReceiptGenerator } from "@/components/ReceiptGenerator";

const Donate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [donorName, setDonorName] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    food_type: "",
    quantity: "",
    pickup_location: "",
    available_until: "",
    contact_phone: "",
  });

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Please sign in to post donations");
        navigate("/login");
      } else {
        setIsAuthenticated(true);
        setDonorName(session.user.user_metadata.full_name || "Donor");
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const { error } = await supabase.from("donations").insert({
        user_id: session.user.id,
        title: formData.title,
        description: formData.description,
        food_type: formData.food_type,
        quantity: formData.quantity,
        pickup_location: formData.pickup_location,
        available_until: formData.available_until,
        contact_phone: formData.contact_phone,
        status: "available",
      });

      if (error) throw error;

      // Generate receipt data
      const receipt = {
        donorName: donorName,
        donationType: formData.food_type,
        quantity: formData.quantity,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        location: formData.pickup_location,
        receiptId: `DN-${Date.now()}`,
      };
      
      setReceiptData(receipt);
      setShowReceipt(true);
      toast.success("Donation posted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to post donation");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <BackToHomeButton />
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Donation Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Fresh Vegetable Curry"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the food, preparation method, ingredients..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="food_type">Food Type</Label>
                  <Select
                    value={formData.food_type}
                    onValueChange={(value) => setFormData({ ...formData, food_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select food type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    placeholder="e.g., 50 servings, 10 kg"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickup_location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Pickup Location
                </Label>
                <Input
                  id="pickup_location"
                  placeholder="Enter full address"
                  value={formData.pickup_location}
                  onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="available_until" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Available Until
                  </Label>
                  <Input
                    id="available_until"
                    type="datetime-local"
                    value={formData.available_until}
                    onChange={(e) => setFormData({ ...formData, available_until: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Phone
                  </Label>
                  <Input
                    id="contact_phone"
                    type="tel"
                    placeholder="+91 XXXXXXXXXX"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary"
                size="lg"
                disabled={loading}
              >
                {loading ? "Posting..." : "Post Donation"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Receipt Display */}
        {showReceipt && receiptData && (
          <Card className="mt-6 border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Donation Receipt</span>
                <ReceiptGenerator data={receiptData} />
              </CardTitle>
              <CardDescription>
                Your donation has been recorded successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Donor</p>
                  <p className="font-semibold">{receiptData.donorName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Receipt ID</p>
                  <p className="font-mono text-sm">{receiptData.receiptId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Food Type</p>
                  <p className="font-semibold capitalize">{receiptData.donationType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-semibold">{receiptData.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">{receiptData.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-semibold">{receiptData.time}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Donate;
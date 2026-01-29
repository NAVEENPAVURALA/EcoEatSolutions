import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "@/firebase/config";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, MapPin, Clock, ArrowRight, Loader2, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import vegImg from "@/assets/veg-food.png";
import nonVegImg from "@/assets/non-veg-food.png";
import bakeryImg from "@/assets/bakery-food.png";

const Browse = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const q = query(
        collection(db, "donations"),
        where("status", "==", "available"),
        orderBy("created_at", "desc")
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDonations(items);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!auth.currentUser) {
      toast.error("Please login to claim donations");
      return;
    }
    setClaiming(true);
    try {
      const donationRef = doc(db, "donations", selectedDonation.id);
      await updateDoc(donationRef, {
        status: "claimed",
        claimedBy: auth.currentUser.uid,
        claimedAt: new Date().toISOString()
      });
      toast.success("Donation claimed successfully! Please coordinate pickup.");
      setSelectedDonation(null);
      fetchDonations(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error("Failed to claim donation");
    } finally {
      setClaiming(false);
    }
  };

  const filteredDonations = donations.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-secondary/30 py-8 px-4">
      <div className="container mx-auto max-w-6xl animate-fade-in">

        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Available Food</h1>
            <p className="text-muted-foreground">Find fresh surplus food near you.</p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by food or location..."
                className="pl-10 h-10 bg-white shadow-sm border-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-10 px-3 bg-white border-none shadow-sm">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-muted/50 rounded-2xl animate-pulse" />)}
          </div>
        ) : filteredDonations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((item) => (
              <Card key={item.id} className="glass-card flex flex-col items-start hover:shadow-lg transition-all border-white/20 h-full group">
                <div className="relative w-full h-48 bg-secondary/20 overflow-hidden">
                  <img
                    src={item.food_type === "non-veg" ? nonVegImg : item.food_type === "bakery" ? bakeryImg : vegImg}
                    alt={item.type}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-black backdrop-blur-sm shadow-sm hover:bg-white">{item.type || "Food"}</Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardHeader className="p-4 pt-0 w-full mb-auto">
                  <h3 className="font-bold text-xl mb-1 line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground gap-1 mb-2">
                    <MapPin className="w-3 h-3" /> <span className="line-clamp-1">{item.address} (approx)</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                </CardHeader>

                <CardFooter className="p-4 w-full border-t border-border/50">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3 mr-1" /> {item.pickupTime || "Flexible"}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => setSelectedDonation(item)}>View</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>{selectedDonation?.title}</DialogTitle>
                          <DialogDescription>
                            Posted by {selectedDonation?.userName || "Anonymous"}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                              <p className="font-semibold">{selectedDonation?.quantity}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-muted-foreground">Type</p>
                              <p className="font-semibold capitalize">{selectedDonation?.type}</p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Pickup Address</p>
                            <p>{selectedDonation?.address}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Description</p>
                            <p className="text-sm">{selectedDonation?.description}</p>
                          </div>
                        </div>
                        <DialogFooter className="sm:justify-between">
                          <Button variant="secondary" type="button" onClick={() => setSelectedDonation(null)}>
                            Close
                          </Button>
                          <Button type="button" onClick={handleClaim} disabled={claiming} className="bg-primary text-white">
                            {claiming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Claim"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-muted mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No food found</h2>
            <p className="text-muted-foreground">Try adjusting your search or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
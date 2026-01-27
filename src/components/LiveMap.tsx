import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Navigation, Copy } from "lucide-react";
import { auth, db } from "@/firebase/config";
import { collection, query, where, onSnapshot, doc, setDoc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";

interface Location {
  id: string;
  username: string;
  user_type: string;
  latitude: number;
  longitude: number;
  unique_code: string;
}

const LiveMap = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [userType, setUserType] = useState<string>("");
  const [uniqueCode, setUniqueCode] = useState<string>("");
  const [isSharing, setIsSharing] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);



  useEffect(() => {
    // Realtime listener for active locations
    const q = query(collection(db, "live_locations"), where("is_active", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const distinctLocations = new Map();
      snapshot.docs.forEach(doc => {
        // Use a map to handle distinct users if needed, or just map all
        distinctLocations.set(doc.id, { id: doc.id, ...doc.data() });
      });
      setLocations(Array.from(distinctLocations.values()) as Location[]);
    });

    return () => unsubscribe();
  }, []);

  const generateUniqueCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const startSharing = async () => {
    if (!userType) {
      toast.error("Please select your user type");
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    if (!auth.currentUser) {
      toast.error("Please sign in to share your location");
      return;
    }

    const code = generateUniqueCode();
    setUniqueCode(code);
    const userId = auth.currentUser.uid;
    const userName = auth.currentUser.displayName || "Anonymous";

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          await setDoc(doc(db, "live_locations", userId), {
            user_id: userId,
            username: userName,
            user_type: userType,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            unique_code: code,
            is_active: true,
            updated_at: new Date().toISOString()
          }, { merge: true });

          if (!isSharing) {
            setIsSharing(true);
            toast.success(`Sharing location! Your code: ${code}`);
          }
        } catch (error) {
          console.error("Error updating location:", error);
          toast.error("Failed to update location");
        }
      },
      (error) => {
        console.error("Location error:", error);
        toast.error("Failed to get location. Please enable location permissions.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    setWatchId(id);
  };

  const stopSharing = async () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, "live_locations", auth.currentUser.uid), {
          is_active: false
        });
      } catch (error) {
        console.error("Error stopping sharing:", error);
      }
    }

    setIsSharing(false);
    setUniqueCode("");
    toast.info("Stopped sharing location");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(uniqueCode);
    toast.success("Code copied to clipboard!");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Navigation className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Live Location Map</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="userType">I am a:</Label>
            <Select value={userType} onValueChange={setUserType} disabled={isSharing}>
              <SelectTrigger id="userType" className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="donor">Donor</SelectItem>
                <SelectItem value="receiver">Receiver</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!isSharing ? (
            <Button onClick={startSharing} className="w-full gradient-primary">
              <MapPin className="mr-2 h-4 w-4" />
              Start Sharing Location
            </Button>
          ) : (
            <Button onClick={stopSharing} variant="destructive" className="w-full">
              Stop Sharing
            </Button>
          )}

          {uniqueCode && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <Label>Your Unique Code:</Label>
              <div className="flex gap-2">
                <Input value={uniqueCode} readOnly className="font-mono text-lg" />
                <Button onClick={copyCode} size="icon" variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this code with others to let them find you
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <Label>Active Locations ({locations.length})</Label>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
          {locations.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No active locations yet
            </div>
          )}
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{loc.username}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${loc.user_type === "donor"
                        ? "bg-green-500/20 text-green-600"
                        : "bg-blue-500/20 text-blue-600"
                        }`}
                    >
                      {loc.user_type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Code: {loc.unique_code}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Lat: {loc.latitude.toFixed(4)}, Lng: {loc.longitude.toFixed(4)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    window.open(
                      `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`,
                      "_blank"
                    );
                  }}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default LiveMap;
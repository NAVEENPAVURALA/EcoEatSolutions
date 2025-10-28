import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

const LocationService = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        setLocation(locationData);
        setIsLoading(false);
        toast.success("Location obtained successfully!");
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location permission denied. Please enable location access.");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information unavailable.");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out.");
            break;
          default:
            toast.error("An unknown error occurred.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        setLocation(locationData);
        setIsTracking(true);
      },
      (error) => {
        console.error("Tracking error:", error);
        toast.error("Location tracking error");
        stopTracking();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
    toast.success("Real-time location tracking started");
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
      toast.info("Location tracking stopped");
    }
  };

  const openInMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.open(url, "_blank");
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Real-Time Location Service</h3>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            onClick={getCurrentLocation}
            disabled={isLoading || isTracking}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Get Current Location
              </>
            )}
          </Button>

          {!isTracking ? (
            <Button onClick={startTracking} variant="secondary" className="flex-1">
              Start Tracking
            </Button>
          ) : (
            <Button onClick={stopTracking} variant="destructive" className="flex-1">
              Stop Tracking
            </Button>
          )}
        </div>

        {location && (
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-semibold">Latitude:</span>
                <p className="text-muted-foreground">{location.latitude.toFixed(6)}</p>
              </div>
              <div>
                <span className="font-semibold">Longitude:</span>
                <p className="text-muted-foreground">{location.longitude.toFixed(6)}</p>
              </div>
              <div>
                <span className="font-semibold">Accuracy:</span>
                <p className="text-muted-foreground">{location.accuracy.toFixed(0)} meters</p>
              </div>
              <div>
                <span className="font-semibold">Updated:</span>
                <p className="text-muted-foreground">
                  {new Date(location.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <Button onClick={openInMaps} variant="outline" className="w-full mt-2">
              View on Google Maps
            </Button>
          </div>
        )}

        {isTracking && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
            <span>Tracking your location in real-time</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LocationService;

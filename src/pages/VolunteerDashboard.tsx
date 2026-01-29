import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { MapPin, Package, Clock, Truck, CheckCircle2, Navigation, ScanLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRScanner } from "@/components/QRScanner";

const VolunteerDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [availableRuns, setAvailableRuns] = useState<any[]>([]);
    const [myRuns, setMyRuns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [scanRunId, setScanRunId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                navigate("/login");
                return;
            }
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, [navigate]);

    // Fetch Available Runs (Status: available, Transport: pending/null)
    useEffect(() => {
        const q = query(
            collection(db, "donations"),
            where("status", "==", "available")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                .filter((item: any) => !item.transport_status || item.transport_status === "pending");
            setAvailableRuns(items);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Fetch My Active Runs
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, "donations"),
            where("volunteerId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMyRuns(items);
        });
        return () => unsubscribe();
    }, [user]);

    const handleAcceptRun = async (donationId: string) => {
        try {
            await updateDoc(doc(db, "donations", donationId), {
                transport_status: "assigned",
                volunteerId: user.uid,
                updated_at: new Date().toISOString()
            });
            toast.success("Run accepted! Head to the pickup location.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to accept run");
        }
    };

    const updateRunStatus = async (donationId: string, status: string) => {
        try {
            await updateDoc(doc(db, "donations", donationId), {
                transport_status: status,
                updated_at: new Date().toISOString()
            });
            toast.success(`Status updated to: ${status.replace("_", " ")}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        }
    };

    const handleScanComplete = async (data: string) => {
        if (!scanRunId) return;

        // Expected format "verify:{donationId}"
        const parts = data.split(":");
        const prefix = parts[0];
        const scannedId = parts[1];

        if (prefix !== "verify" || scannedId !== scanRunId) {
            toast.error("Invalid QR Code. Please scan the correct code for this donation.");
            return;
        }

        const run = myRuns.find(r => r.id === scanRunId);
        if (!run) return;

        if (run.transport_status === "assigned") {
            await updateRunStatus(scanRunId, "in_transit");
            toast.success("Pickup Verified! Start your journey.");
        } else if (run.transport_status === "in_transit") {
            await updateRunStatus(scanRunId, "delivered");
            toast.success("Delivery Verified! Great job.");
        }

        setScanRunId(null);
    };

    return (
        <div className="min-h-screen bg-secondary/30 py-8 px-4">
            <div className="container mx-auto max-w-5xl animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Volunteer Portal</h1>
                        <p className="text-muted-foreground">Manage deliveries and bridge the gap.</p>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="px-3 py-1 bg-white/50">
                            <Truck className="w-4 h-4 mr-2 text-primary" />
                            {myRuns.filter((r: any) => r.transport_status !== "delivered").length} Active Runs
                        </Badge>
                    </div>
                </div>

                <Tabs defaultValue="available" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/40">
                        <TabsTrigger value="available">Available Runs</TabsTrigger>
                        <TabsTrigger value="my-runs">My Deliveries</TabsTrigger>
                    </TabsList>

                    <TabsContent value="available" className="space-y-4">
                        <h2 className="text-lg font-semibold mb-4">Nearby Pickups</h2>
                        {availableRuns.length === 0 ? (
                            <div className="text-center py-20 bg-white/40 rounded-2xl border border-dashed">
                                <Truck className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                                <p className="text-muted-foreground">No pending deliveries nearby.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                {availableRuns.map((run) => (
                                    <Card key={run.id} className="glass-card border-white/20 hover:shadow-lg transition-all">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg">{run.title}</CardTitle>
                                                    <p className="text-sm text-muted-foreground">from {run.userName}</p>
                                                </div>
                                                <Badge variant="secondary">{run.quantity}</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-primary" />
                                                <span className="truncate">{run.address}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-orange-500" />
                                                <span>Pickup: {run.pickupTime || "Flexible"}</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button onClick={() => handleAcceptRun(run.id)} className="w-full bg-primary hover:bg-primary/90 text-white shadow-glow">
                                                Accept Run
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="my-runs" className="space-y-4">
                        <h2 className="text-lg font-semibold mb-4">Active Missions</h2>
                        {myRuns.length === 0 ? (
                            <div className="text-center py-20 bg-white/40 rounded-2xl border border-dashed">
                                <Navigation className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                                <p className="text-muted-foreground">You haven't accepted any runs yet.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {myRuns.filter((r: any) => r.transport_status !== "delivered").map((run) => (
                                    <Card key={run.id} className="glass-card border-l-4 border-l-primary flex flex-col md:flex-row overflow-hidden">
                                        <div className="p-6 flex-1 space-y-2">
                                            <div className="flex justify-between">
                                                <h3 className="font-bold text-xl">{run.title}</h3>
                                                <Badge className={
                                                    run.transport_status === "in_transit" ? "bg-amber-500" : "bg-blue-500"
                                                }>
                                                    {run.transport_status?.replace("_", " ").toUpperCase()}
                                                </Badge>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4 mt-2">
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Pickup</p>
                                                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {run.address}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Instructions</p>
                                                    <p className="text-sm">{run.description || "No specific instructions"}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-secondary/40 p-6 flex flex-col justify-center gap-3 min-w-[200px] border-l border-white/10">
                                            {run.transport_status === "assigned" && (
                                                <Button onClick={() => setScanRunId(run.id)} variant="secondary" className="gap-2">
                                                    <ScanLine className="w-4 h-4" />
                                                    Scan to Pickup
                                                </Button>
                                            )}
                                            {run.transport_status === "in_transit" && (
                                                <Button onClick={() => setScanRunId(run.id)} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                                    <ScanLine className="w-4 h-4" />
                                                    Scan to Deliver
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => updateRunStatus(run.id, run.transport_status === 'assigned' ? 'in_transit' : 'delivered')}>
                                                (Debug: Skip Scan)
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog open={!!scanRunId} onOpenChange={() => setScanRunId(null)}>
                <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-center pb-4 border-b">
                            Verify {myRuns.find(r => r.id === scanRunId)?.transport_status === "assigned" ? "Pickup" : "Delivery"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-6">
                        <QRScanner onScan={handleScanComplete} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default VolunteerDashboard;

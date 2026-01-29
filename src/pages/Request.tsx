import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, HandPlatter, Calendar, MapPin, Phone } from "lucide-react";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "sonner";
import { BackToHomeButton } from "@/components/BackToHomeButton";

const Request = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        needed_by: "",
        quantity_needed: "",
        delivery_location: "",
        contact_phone: "",
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                toast.error("Please sign in to post requests");
                navigate("/login");
            } else {
                setIsAuthenticated(true);
                setUserId(user.uid);
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!auth.currentUser) throw new Error("Not authenticated");

            await addDoc(collection(db, "requests"), {
                user_id: userId,
                ...formData,
                status: "active",
                created_at: new Date().toISOString(),
            });

            toast.success("Request posted successfully!");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Failed to post request");
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
            <BackToHomeButton />
            <div className="container mx-auto px-4 py-8">
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Request Food Support</h1>
                    <p className="text-muted-foreground">
                        Let donors know what your community needs
                    </p>
                </div>

                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HandPlatter className="h-5 w-5" />
                            Create Food Request
                        </CardTitle>
                        <CardDescription>
                            Details about the food assistance required
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Request Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Lunch for 50 people"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description & Requirements</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe dietary needs, packaging requirements, etc."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows={4}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity Needed</Label>
                                    <Input
                                        id="quantity"
                                        placeholder="e.g., 50 packets / 10kg rice"
                                        value={formData.quantity_needed}
                                        onChange={(e) => setFormData({ ...formData, quantity_needed: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="needed_by">Needed By</Label>
                                    <Input
                                        id="needed_by"
                                        type="datetime-local"
                                        value={formData.needed_by}
                                        onChange={(e) => setFormData({ ...formData, needed_by: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Delivery/Pickup Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="location"
                                        className="pl-9"
                                        placeholder="Enter full address"
                                        value={formData.delivery_location}
                                        onChange={(e) => setFormData({ ...formData, delivery_location: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Contact Phone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        className="pl-9"
                                        type="tel"
                                        placeholder="+91..."
                                        value={formData.contact_phone}
                                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                                {loading ? "Posting..." : "Submit Request"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Request;

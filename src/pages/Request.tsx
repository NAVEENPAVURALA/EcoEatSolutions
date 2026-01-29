import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, HeartHandshake, MapPin, Calendar, Phone } from "lucide-react";

/**
 * Premium single-column request form.
 * Mirrors the style of the Donate form for consistency.
 */
const Request = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        peopleCount: "",
        neededBy: "",
        location: "",
        contact: ""
    });

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                toast.error("Please login to request food");
                navigate("/login");
                return;
            }
            setUser(currentUser);
        });
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, "requests"), {
                ...formData,
                userId: user.uid,
                status: "active",
                created_at: new Date().toISOString(),
                userName: user.displayName
            });

            toast.success("Request posted. We'll notify donors nearby.");
            navigate("/dashboard");
        } catch (error) {
            toast.error("Failed to post request");
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
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Request Support</h1>
                    <p className="text-muted-foreground text-lg">
                        Let our network know what your community needs.
                    </p>
                </div>

                {/* Form Card */}
                <Card className="glass-card shadow-xl border-white/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HeartHandshake className="w-5 h-5 text-primary" />
                            Requirement Details
                        </CardTitle>
                        <CardDescription>We will prioritize matching these needs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">

                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Reason / Event Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Dinner for 50 at Community Shelter"
                                        className="h-12 bg-white/50"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="count">People Count</Label>
                                        <Input
                                            id="count"
                                            placeholder="Approx. number"
                                            className="h-12 bg-white/50"
                                            value={formData.peopleCount}
                                            onChange={(e) => setFormData({ ...formData, peopleCount: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="date">Needed By</Label>
                                        <div className="relative">
                                            <Input
                                                id="date"
                                                type="date"
                                                className="h-12 bg-white/50 pl-10"
                                                value={formData.neededBy}
                                                onChange={(e) => setFormData({ ...formData, neededBy: e.target.value })}
                                            />
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="desc">Specific Requirements</Label>
                                    <Textarea
                                        id="desc"
                                        placeholder="Any dietary restrictions or specific items needed..."
                                        className="min-h-[100px] bg-white/50 resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-border/50">
                                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    <MapPin className="w-4 h-4" /> Contact & Location
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="location">Delivery Location</Label>
                                    <Input
                                        id="location"
                                        placeholder="Full address"
                                        className="h-12 bg-white/50"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="contact">Contact Number</Label>
                                    <div className="relative">
                                        <Input
                                            id="contact"
                                            placeholder="primary contact for coordination"
                                            className="h-12 bg-white/50 pl-10"
                                            value={formData.contact}
                                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        />
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Submit Request"}
                                </Button>
                            </div>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Request;

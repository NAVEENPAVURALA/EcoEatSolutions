import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, db, googleProvider } from "@/firebase/config";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "sonner";
import { Loader2, ArrowLeft, User, Utensils, Building2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    userType: "individual"
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      await setDoc(doc(db, "users", user.uid), {
        full_name: formData.fullName,
        email: formData.email,
        user_type: formData.userType,
        created_at: new Date().toISOString()
      });

      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        full_name: user.displayName,
        email: user.email,
        user_type: formData.userType, // Use selected type
        created_at: new Date().toISOString()
      }, { merge: true });

      toast.success("Account created with Google!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Google Sign-Up failed");
      console.error(error);
    }
  };

  const UserTypeCard = ({ type, icon: Icon, label, desc }: any) => (
    <div
      onClick={() => setFormData({ ...formData, userType: type })}
      className={`cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 ${formData.userType === type
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border/50 hover:border-border hover:bg-secondary/50"
        }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${formData.userType === type ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`font-semibold ${formData.userType === type ? "text-primary" : "text-foreground"}`}>{label}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-snug pl-[3.25rem]">{desc}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-secondary/30 py-10">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-2xl px-4 animate-fade-in-up">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 hover:bg-transparent hover:text-primary p-0"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>

        <Card className="glass-card border-white/20 shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-5 h-full">
            {/* Left Side: Form */}
            <div className="md:col-span-3 p-6 md:p-8 space-y-6">
              <div>
                <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                <CardDescription>Start your journey to zero waste</CardDescription>
              </div>

              {/* User Type Selection */}
              <div className="space-y-3">
                <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">I am a...</Label>
                <div className="flex flex-col gap-2">
                  <UserTypeCard type="individual" icon={User} label="Donor" desc="I want to share food with neighbors." />
                  <div className="grid grid-cols-2 gap-2">
                    <UserTypeCard type="restaurant" icon={Utensils} label="Restaurant" desc="Donate surplus meals." />
                    <UserTypeCard type="organization" icon={Building2} label="NGO" desc="Request food for many." />
                  </div>
                </div>
              </div>

              <form onSubmit={handleSignup} className="space-y-4 pt-4 border-t border-border/50">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    required
                    className="bg-white/50 border-input/50"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    className="bg-white/50 border-input/50"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    className="bg-white/50 border-input/50"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full shadow-glow bg-primary hover:bg-primary/90 mt-4"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground/70">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full hover:bg-secondary/50"
                  onClick={handleGoogleSignup}
                >
                  Sign up with Google
                </Button>
              </form>
            </div>

            {/* Right Side: Visual (Hidden on mobile) */}
            <div className="hidden md:flex md:col-span-2 bg-gradient-to-br from-primary/90 to-blue-900/90 text-white p-8 flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80')] bg-cover opacity-10 mix-blend-overlay" />
              <div className="relative z-10">
                <Leaf className="w-8 h-8 mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-2">Join the movement</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  "The most impactful way to fight climate change is to stop wasting food."
                </p>
              </div>
              <div className="relative z-10">
                <div className="text-3xl font-bold">2.5k+</div>
                <div className="text-white/60 text-sm">Meals shared this month</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;

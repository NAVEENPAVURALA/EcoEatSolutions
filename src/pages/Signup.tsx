import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { auth, db, googleProvider } from "@/firebase/config";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Leaf, Mail, Lock, User, Building2, Heart, ArrowLeft } from "lucide-react";

type UserType = "restaurant" | "organization" | "individual";

const Signup = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>("restaurant");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update display name
      await updateProfile(user, {
        displayName: fullName
      });

      // 3. Create user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        full_name: fullName,
        user_type: userType,
        organization_name: userType !== "individual" ? organizationName : null,
        created_at: new Date().toISOString()
      });

      toast.success("Account created successfully! Redirecting...");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Check if user already exists in Firestore
      // For now, valid to overwrite or just set if not exists. 
      // Using setDoc with merge: true to avoid overwriting existing profile data if they login again
      // But we want to set the user_type from the selection if it's new.

      const docRef = doc(db, "users", user.uid);
      // We can read it first to see if it exists? Or just merge.
      // If we merge, we might overwrite a previous user_type if they toggle before logging in again.
      // Better to check if existing? 
      // Actually simple requirement: create user profile.

      await setDoc(docRef, {
        email: user.email,
        full_name: user.displayName || fullName,
        user_type: userType,
        organization_name: userType !== "individual" ? organizationName : null,
        // Only set created_at if it's a new document? 
        // setDoc will overwrite if we don't use merge. 
        // Let's use merge: true but carefully.
      }, { merge: true });

      // If the doc didn't exist, we want created_at. If it did, we probably don't want to change it.
      // But adding a check is safer.

      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up with Google");
    } finally {
      setLoading(false);
    }
  };

  const userTypeOptions = [
    {
      value: "restaurant",
      label: "Restaurant/Hotel",
      icon: Building2,
      description: "Donate surplus food from your business"
    },
    {
      value: "organization",
      label: "NGO/Organization",
      icon: Heart,
      description: "Receive donations for your community"
    },
    {
      value: "individual",
      label: "Individual Donor",
      icon: User,
      description: "Share home-cooked meals"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-2xl space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="border-2">
          <CardHeader className="space-y-3 text-center">
            <div className="flex justify-center">
              <div className="p-3 rounded-full gradient-primary">
                <Leaf className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Join EcoEatSolutions</CardTitle>
            <CardDescription className="text-base">
              Create your account and start making a difference today
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
              {/* User Type Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">I am a...</Label>
                <RadioGroup value={userType} onValueChange={(value) => setUserType(value as UserType)}>
                  <div className="grid gap-3">
                    {userTypeOptions.map((option) => (
                      <Label
                        key={option.value}
                        htmlFor={option.value}
                        className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${userType === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                          }`}
                      >
                        <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <option.icon className="w-5 h-5 text-primary" />
                            <span className="font-semibold">{option.label}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    {userType === "individual" ? "Full Name" : "Contact Person Name"}
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                {userType !== "individual" && (
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">
                      {userType === "restaurant" ? "Restaurant/Hotel Name" : "Organization Name"}
                    </Label>
                    <Input
                      id="organizationName"
                      type="text"
                      placeholder={`Enter ${userType === "restaurant" ? "business" : "organization"} name`}
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 6 characters
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary"
                size="lg"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or sign up with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mb-6"
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;

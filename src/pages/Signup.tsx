import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            user_type: userType,
            organization_name: userType !== "individual" ? organizationName : null,
          },
        },
      });

      if (error) throw error;

      toast.success("Account created successfully! Redirecting...");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
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
                        className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          userType === option.value
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

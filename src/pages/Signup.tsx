import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Leaf, Mail, Lock, User, Building2, Heart, ArrowLeft, Phone } from "lucide-react";

type UserType = "restaurant" | "organization" | "individual";

const Signup = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>("restaurant");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setLoading(true);
    try {
      // Format phone number with country code if not present
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      toast.success("OTP sent to your phone!");
      setOtpSent(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setVerifying(true);
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;

      // Now complete the signup with email/password
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            user_type: userType,
            organization_name: userType !== "individual" ? organizationName : null,
            phone_number: formattedPhone,
          },
        },
      });

      if (signupError) throw signupError;

      toast.success("Account created successfully! Redirecting...");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to verify OTP");
    } finally {
      setVerifying(false);
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
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
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
                  <Label htmlFor="email">Email</Label>
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
                  <Label htmlFor="password">Password</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll send you an OTP to verify your phone number
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary"
                size="lg"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    We sent a 6-digit code to {phoneNumber}
                  </p>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-primary"
                  size="lg"
                  disabled={verifying}
                >
                  {verifying ? "Verifying..." : "Verify & Create Account"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                >
                  Change Phone Number
                </Button>
              </form>
            )}

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

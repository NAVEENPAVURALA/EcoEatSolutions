import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Heart, Users, Leaf, ArrowRight, Mail, Phone, AlertTriangle, Siren, Apple, Globe, Languages } from "lucide-react";
import { useState } from "react";
import heroBanner from "@/assets/hero-banner.jpg";
import restaurantIcon from "@/assets/restaurant-icon.png";
import organizationIcon from "@/assets/organization-icon.png";
import individualIcon from "@/assets/individual-icon.png";

const Index = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("English");

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी (Hindi)" },
    { code: "ta", name: "தமிழ் (Tamil)" },
    { code: "te", name: "తెలుగు (Telugu)" },
    { code: "bn", name: "বাংলা (Bengali)" },
    { code: "mr", name: "मराठी (Marathi)" }
  ];

  const userTypes = [
    {
      icon: restaurantIcon,
      title: "Restaurants & Hotels",
      description: "Turn surplus food into community impact. Donate excess meals and track your positive influence.",
      color: "from-primary to-primary-glow"
    },
    {
      icon: organizationIcon,
      title: "NGOs & Organizations",
      description: "Access fresh, quality food donations for your community. Feed more people with less effort.",
      color: "from-secondary to-blue-400"
    },
    {
      icon: individualIcon,
      title: "Individual Donors",
      description: "Share home-cooked meals with neighbors in need. Every contribution creates lasting change.",
      color: "from-accent to-orange-400"
    }
  ];

  const stats = [
    { number: "50K+", label: "Meals Donated", icon: Heart },
    { number: "500+", label: "Active Partners", icon: Users },
    { number: "10K Kg", label: "Waste Prevented", icon: Leaf }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Language Selector - Fixed Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-background/95 backdrop-blur shadow-lg">
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline">{language}</span>
              <Globe className="w-4 h-4 sm:hidden" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-background z-50">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.name.split(" ")[0])}
                className="cursor-pointer"
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        
        <div className="container relative mx-auto px-4 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Fighting Food Waste Together</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Transform Surplus into{" "}
                <span className="gradient-hero text-gradient">Sustenance</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join India's largest food redistribution network. Connect donors with communities in need, 
                eliminate waste, and create meaningful impact—one meal at a time.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="gradient-primary hover:shadow-glow"
                  onClick={() => navigate("/signup")}
                >
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 gradient-hero opacity-20 blur-3xl rounded-full" />
              <img 
                src={heroBanner} 
                alt="Community sharing food" 
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Mode Section */}
      <section className="relative -mt-16 pb-8 z-10">
        <div className="container mx-auto px-4">
          <Alert className="bg-gradient-to-r from-accent via-accent/90 to-orange-600 border-accent/50 shadow-2xl shadow-accent/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-white/20 backdrop-blur animate-pulse">
                <Siren className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <AlertTitle className="text-white text-2xl font-bold mb-2 flex items-center gap-2">
                  Emergency Response Mode
                  <AlertTriangle className="w-5 h-5" />
                </AlertTitle>
                <AlertDescription className="text-white/90 text-base mb-4">
                  Activate priority alerts during natural disasters and emergencies. Get immediate support from nearby donors and volunteers with real-time coordination for rapid crisis response.
                </AlertDescription>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    size="lg"
                    className="bg-white text-accent hover:bg-white/90 font-semibold shadow-lg"
                    onClick={() => navigate("/signup")}
                  >
                    Activate Emergency Mode
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </Alert>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="p-8 bg-card/80 backdrop-blur border-primary/10 hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Who We Serve</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              EcoEatSolutions brings together everyone in the food ecosystem to create sustainable impact
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden p-8 border-2 hover:border-primary/50 transition-all hover:shadow-xl cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                <div className="relative space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-4 group-hover:scale-110 transition-transform">
                    <img src={type.icon} alt={type.title} className="w-full h-full object-contain" />
                  </div>
                  
                  <h3 className="text-2xl font-bold">{type.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{type.description}</p>
                  
                  <div className="flex items-center text-primary font-semibold pt-4">
                    Learn More <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nutrition Information Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
                <Apple className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Nutrition Tracking</span>
              </div>
              
              <h2 className="text-4xl font-bold">
                Complete Nutrition Information for Every Meal
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Track calories, nutrients, and dietary restrictions for all donated food. Our platform ensures recipients receive balanced meals while donors can showcase the nutritional value of their contributions.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Dietary Restriction Filters</h4>
                    <p className="text-sm text-muted-foreground">Vegetarian, vegan, gluten-free, and more dietary preferences</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-secondary/10 mt-1">
                    <Users className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Meal Planning Assistance</h4>
                    <p className="text-sm text-muted-foreground">Help organizations plan balanced meals for their communities</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-accent/10 mt-1">
                    <AlertTriangle className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Food Safety Guidelines</h4>
                    <p className="text-sm text-muted-foreground">Expiry tracking and safety alerts to ensure quality</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Calories Tracked Daily</div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <div className="text-3xl font-bold text-secondary mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Dietary Preferences</div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <div className="text-3xl font-bold text-accent mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Safety Compliance</div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Nutrition Support</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to make a big difference</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Sign Up", desc: "Create your account in minutes" },
              { step: "02", title: "Post or Request", desc: "Share surplus or request food" },
              { step: "03", title: "Get Matched", desc: "Connect with nearby partners" },
              { step: "04", title: "Make Impact", desc: "Complete donation & track results" }
            ].map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary text-primary-foreground text-xl font-bold shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden p-12 md:p-16 gradient-hero">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join thousands of donors and organizations working together to end food waste and hunger
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => navigate("/signup")}
                >
                  Start Donating Today
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => navigate("/signup")}
                >
                  Register Your Organization
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold gradient-primary text-gradient">EcoEatSolutions</h3>
              <p className="text-muted-foreground text-sm">
                Transforming food waste into community sustenance across India
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">For Restaurants</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">For NGOs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">For Individuals</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Safety Guidelines</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@ecoeatsolutions.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 1800-XXX-XXXX</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 EcoEatSolutions. All rights reserved. Fighting food waste, one meal at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

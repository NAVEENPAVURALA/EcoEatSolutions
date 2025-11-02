import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, TrendingUp, MapPin, MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DarkModeToggle from "@/components/DarkModeToggle";
import LiveMap from "@/components/LiveMap";
import CommunityChat from "@/components/CommunityChat";
import { RecentDonations } from "@/components/RecentDonations";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  useEffect(() => {
    // Force scroll to top on page load
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    window.history.scrollRestoration = 'manual';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-primary">Food Share</h1>
            <div className="flex items-center gap-4">
              <DarkModeToggle />
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full">
              <span className="text-white text-sm font-semibold">
                Fighting Food Waste Together
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Transform Surplus into <span className="text-primary">Sustenance</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-200 mb-8">
              Join India's largest food redistribution network. Connect donors with communities in need,
              eliminate waste, and create meaningful impact—one meal at a time.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/browse">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20">
                  Browse Donations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Donations - Live Feed */}
      <RecentDonations />

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose Food Share?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Making food donation simple, transparent, and impactful
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Community Impact</CardTitle>
                <CardDescription>
                  Connect with local communities and make a real difference in your neighborhood
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Heart className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Easy Donations</CardTitle>
                <CardDescription>
                  Simple process to donate excess food and help those in need with just a few clicks
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Track Your Impact</CardTitle>
                <CardDescription>
                  Monitor your contributions and see the positive change you're creating
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Map */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">Live Location Tracking</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Real-Time Donation Map</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              See active donations near you and track food distribution in real-time
            </p>
          </div>
          <LiveMap />
        </div>
      </section>

      {/* Community Chat */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">Community Connect</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join the Conversation</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Connect with donors and receivers in your area
            </p>
          </div>
          <CommunityChat />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90">
            Join thousands of donors and organizations working together to end food waste and hunger
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="text-lg">
                Start Donating Today
              </Button>
            </Link>
            <Link to="/browse">
              <Button size="lg" variant="outline" className="text-lg border-white text-white hover:bg-white/10">
                Browse Available Food
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Food Share</h3>
              <p className="text-muted-foreground text-sm">
                Transforming food waste into community sustenance across India
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/donate" className="hover:text-primary">For Restaurants</Link></li>
                <li><Link to="/browse" className="hover:text-primary">For NGOs</Link></li>
                <li><Link to="/signup" className="hover:text-primary">For Individuals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Safety Guidelines</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: support@foodshare.in</li>
                <li>Phone: +91 1800-FOOD-HELP</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 Food Share. All rights reserved. Fighting food waste, one meal at a time.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

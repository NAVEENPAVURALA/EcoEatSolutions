import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Users, ShieldCheck, Globe, HandHeart, Utensils } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

        <div className="container px-4 text-center z-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-secondary mb-8 glass">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-muted-foreground">EcoEat Solutions 2.0 is Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance max-w-4xl mx-auto">
            Food should feed people, <br />
            <span className="text-primary">not landfills.</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
            The intelligent platform connecting surplus food from restaurants with communities in need. Zero waste. Zero hunger.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="h-12 px-8 rounded-full text-lg bg-primary hover:bg-primary/90 shadow-glow transition-all hover:scale-105"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/browse")}
              className="h-12 px-8 rounded-full text-lg border-2 hover:bg-secondary/50 backdrop-blur-sm"
            >
              Browse Food
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-border/40 bg-secondary/20">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-foreground">2.5k+</div>
              <p className="text-muted-foreground font-medium">Meals Recovered</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-foreground">850kg</div>
              <p className="text-muted-foreground font-medium">CO₂ Prevented</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-foreground">120+</div>
              <p className="text-muted-foreground font-medium">Partner NGOs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful connections.</h2>
            <p className="text-lg text-muted-foreground">
              Built for restaurants, NGOs, and individual donors. Our platform handles the logistics so you can focus on the impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="glass-card p-8 rounded-3xl group cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Utensils className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">For Restaurants</h3>
              <p className="text-muted-foreground leading-relaxed">
                Schedule recurring pickups for surplus food. Get tax deduction receipts and sustainability reports automatically.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-card p-8 rounded-3xl group cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">For NGOs</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time alerts for available food in your area. Request specific items and coordinate pickups efficiently.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-card p-8 rounded-3xl group cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <HandHeart className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">For Individuals</h3>
              <p className="text-muted-foreground leading-relaxed">
                Have extra food from an event? Share it instantly with verified local charities or community fridges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-foreground text-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/20 blur-[100px]" />

        <div className="container px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Safety First. Always.</h2>
              <p className="text-lg text-white/70 mb-8 leading-relaxed">
                We take food safety seriously. Every donor is verified, and our intelligent system tracks shelf-life and handling guidelines to ensure quality.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-primary/20 text-primary">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="font-medium">Verified Donor Identity</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-primary/20 text-primary">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <span className="font-medium">Quality Assurance Checks</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-primary/20 text-primary">
                    <Globe className="w-6 h-6" />
                  </div>
                  <span className="font-medium">Real-time Transparent Tracking</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-primary to-blue-600/50 p-8 rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-full bg-black/40 backdrop-blur-xl rounded-[2rem] border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-7xl font-bold mb-2">100%</div>
                    <div className="text-xl opacity-80">Safe Delivery Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 container px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to verify the impact?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of others making a difference today. It takes less than 2 minutes to get started.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/signup")}
            className="h-14 px-10 rounded-full text-xl bg-primary hover:bg-primary/90 shadow-glow hover:scale-105 transition-all"
          >
            Join EcoEat Now
          </Button>
        </div>
      </section>

    </div>
  );
};

export default Index;

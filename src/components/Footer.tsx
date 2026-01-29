import { Leaf, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="bg-secondary/30 border-t border-border/50 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Leaf className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-lg tracking-tight">EcoEat</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Transforming food waste into community sustenance. Join the movement to feed people, not landfills.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-sm">Platform</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/browse" className="hover:text-primary transition-colors">Browse Food</Link></li>
                            <li><Link to="/donate/post" className="hover:text-primary transition-colors">Donate</Link></li>
                            <li><Link to="/request" className="hover:text-primary transition-colors">Request Support</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-sm">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/" className="hover:text-primary transition-colors">Impact</Link></li>
                            <li><Link to="/" className="hover:text-primary transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-sm">Connect</h4>
                        <div className="flex gap-4 text-muted-foreground">
                            <a href="#" className="hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} EcoEatSolutions. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-muted-foreground">
                        <a href="#" className="hover:text-foreground">Privacy Policy</a>
                        <a href="#" className="hover:text-foreground">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

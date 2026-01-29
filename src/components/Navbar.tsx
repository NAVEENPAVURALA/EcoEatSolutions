import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            unsubscribe();
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleSignOut = async () => {
        await signOut(auth);
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Browse", path: "/browse", show: true },
        { name: "Donate", path: "/donate/post", show: true },
        { name: "Leaderboard", path: "/leaderboard", show: true },
        { name: "Messages", path: "/messages", show: !!user },
        { name: "Volunteer", path: "/volunteer", show: !!user },
        { name: "Dashboard", path: "/dashboard", show: !!user },
    ].filter(link => link.show);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass shadow-sm py-3" : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                        <Leaf className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-lg tracking-tight">EcoEat</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <Button variant="ghost" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground">
                            Sign Out
                        </Button>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                                    Log in
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white shadow-glow">
                                    Sign up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-muted-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 glass border-b p-6 animate-fade-in-up">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`text-lg font-medium ${location.pathname === link.path ? "text-primary" : "text-foreground"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-px bg-border my-2" />
                        {user ? (
                            <Button onClick={handleSignOut} variant="ghost" className="justify-start px-0">
                                Sign Out
                            </Button>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full">Log in</Button>
                                </Link>
                                <Link to="/signup" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full bg-primary text-white">Sign up</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

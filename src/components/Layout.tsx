import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Chatbot from "./Chatbot";

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <Navbar />
            <main className="flex-1 pt-20">
                {children}
            </main>
            <Footer />

            {/* Global Overlays */}
            <Chatbot />
            <Toaster />
            <Sonner />
        </div>
    );
};

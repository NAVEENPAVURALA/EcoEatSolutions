import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Layout } from "@/components/Layout";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Browse = lazy(() => import("./pages/Browse"));
const Donate = lazy(() => import("./pages/Donate"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Messages = lazy(() => import("./pages/Messages"));
const VolunteerDashboard = lazy(() => import("./pages/VolunteerDashboard"));
const Request = lazy(() => import("./pages/Request"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/donate/post" element={<Donate />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/volunteer" element={<VolunteerDashboard />} />
              <Route path="/request" element={<Request />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
